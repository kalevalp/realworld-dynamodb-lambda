const recorder = require('watchtower-recorder');

const Util = require('./Util');
// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const jws = require('jws');

const commentsTable = Util.getTableName('comments');

let workingComment;

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
                                                                        console.log(`#####EVENTUPDATE[RETRIEVED_COMMENT(${comment.slug}, ${comment.id})]#####`);
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
                                                                    if (response.data && response.data.Item && response.data.Item.slug)
                                                                        console.log(`#####EVENTUPDATE[COMMENTED(${argumentsList[0].Item.slug},${argumentsList[0].Item.author}, ${argumentsList[0].Item.id})]#####`);
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
                                                                    console.log(`#####EVENTUPDATE[DELETED_ARTICLE(${argumentsList[0].Key}, ${workingComment.author})]#####`);
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

module.exports.create = recorder.createRecordingHandler('src/Comment.js', 'create', mock);
module.exports.get = recorder.createRecordingHandler('src/Comment.js', 'get', mock);
module.exports.delete = recorder.createRecordingHandler('src/Comment.js', 'delete', mock);
