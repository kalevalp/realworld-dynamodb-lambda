const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);

const Util = require('./Util');
// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const jws = require('jws');

const commentsTable = Util.getTableName('comments');

let workingComment;

let context;
let lambdaExecutionContext;
let lambdaInputEvent;
function updateContext(name, event, lambdaContext) {
    context = name;
    lambdaExecutionContext = lambdaContext;
    lambdaInputEvent = event;
}

const mock = {
    'aws-sdk' : new Proxy(aws, {
        get: function (obj, prop) {
            if (prop === "DynamoDB")
                return new Proxy(obj[prop], {
                    get: function (obj, prop) {
                        if (prop === "DocumentClient")
                            return new Proxy(obj[prop], {
                                construct: function (target, args) {
                                    return new Proxy(new target(...args), {
                                        get: function (obj, prop) {
                                            if (prop === 'query')
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === commentsTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function (response) {
                                                                    for (const comment of response.data.Items) {
									eventPublisher({name: "RETRIEVED_COMMENT", params: {article_slug: comment.slug,
															    comment_uuid: comment.id}},
										       lambdaExecutionContext);
                                                                    }
                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });
                                            else if (prop === 'get' && context === 'delete')
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === commentsTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function (response) {
                                                                        workingComment = response.data.Item;
                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });
                                            else if (prop === 'put')
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === commentsTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function (response) {
                                                                    eventPublisher({name: "COMMENTED", params: {article_slug: argumentsList[0].Item.slug,
														user: argumentsList[0].Item.author,
														comment_uuid:argumentsList[0].Item.id}},
										   lambdaExecutionContext);

                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });
                                            else if (prop === 'delete') {
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === commentsTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function () {
                                                                    eventPublisher({name:'DELETED_COMMENT', params: {article_slug: workingComment.slug,
														     comment_uuid: argumentsList[0].Key.id}},
										   lambdaExecutionContext);
                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });

                                            }
                                            else
                                                return obj[prop];
                                        }
                                    });
                                },
                            });
                        else
                            return obj[prop];
                    }});
            else
                return obj[prop];
        }}),
    'jws'     : jws,
};

module.exports.create = recorder.createRecordingHandler('src/Comment.js', 'create', mock, false, updateContext);
module.exports.get = recorder.createRecordingHandler('src/Comment.js', 'get', mock, false, updateContext);
module.exports.delete = recorder.createRecordingHandler('src/Comment.js', 'delete', mock, false, updateContext);
