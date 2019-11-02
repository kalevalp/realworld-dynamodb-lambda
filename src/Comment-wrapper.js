const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);
const batchEventPublisher = recorder.createBatchEventPublisher(eventsStreamName);

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

let ddbdcGetProxy;
function getDdbdcGetProxy(underlyingObj) {
    return new Proxy(underlyingObj, {
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
}
let ddbdcPutProxy;
function getDdbdcPutProxy(underlyingObj) {
    return new Proxy(underlyingObj, {
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
}

let ddbdcQueryProxy;
function getDdbdcQueryProxy(underlyingObj) {
    return new Proxy(underlyingObj, {
        apply: function (target, thisArg, argumentsList) {
            if (argumentsList[0].TableName === commentsTable)
                return target.apply(thisArg, argumentsList)
                .on('success', function (response) {
                    if (response.data.Items.length > 0) {
                        const logEvents = response.data.Items.map(comment => ({name: "RETRIEVED_COMMENT", params: {article_slug: comment.slug,
									                                           comment_uuid: comment.id}}));
                        batchEventPublisher(logEvents,lambdaExecutionContext);
                    }
                });
            else
                return target.apply(thisArg, argumentsList);
        },
    });
}


let ddbdcDeleteProxy;
function getDdbdcDeleteProxy(underlyingObj) {
    return new Proxy(underlyingObj, {
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
                                            if (prop === 'query') {
                                                if (!ddbdcQueryProxy) {
                                                    ddbdcQueryProxy = getDdbdcQueryProxy(obj[prop]);
                                                }
                                                return ddbdcQueryProxy;
                                            } else if (prop === 'get' && context === 'delete') {
                                                if (!ddbdcGetProxy) {
                                                    ddbdcGetProxy = getDdbdcGetProxy(obj[prop]);
                                                }
                                                return ddbdcGetProxy;
                                            } else if (prop === 'put') {
                                                if (!ddbdcPutProxy) {
                                                    ddbdcPutProxy = getDdbdcPutProxy(obj[prop]);
                                                }
                                                return ddbdcPutProxy;
                                            } else if (prop === 'delete') {
                                                if (!ddbdcDeleteProxy) {
                                                    ddbdcDeleteProxy = getDdbdcDeleteProxy(obj[prop]);
                                                }
                                                return ddbdcDeleteProxy;
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
