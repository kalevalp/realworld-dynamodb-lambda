const recorder = require('watchtower-recorder');

const Util = require('./Util');
const usersTable = Util.getTableName('users');
const articlesTable = Util.getTableName('articles');

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const jws = require('jws');

let context;
function updateContext(name) {
    context = name;
}

let workingArticle;

const mock = {
    // './Util' : Util,
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
                                            if (prop === 'get')
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === usersTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function (response) {
                                                                    if (context === 'favorite' || context === 'delete') {
                                                                        workingArticle = response.data.Item;
                                                                    }
                                                                    if (context === 'get') {
                                                                        if (response.data && response.data.Item && response.data.Item.slug)
                                                                            console.log(`#####EVENTUPDATE[RETRIEVED_ARTICLE(${response.data.Item.slug})]#####`);
                                                                    }
                                                                    if (response.data && response.data.Item && response.data.Item.uuid)
                                                                        console.log(`#####EVENTUPDATE[PROCESSING_DATA(${response.data.Item.uuid})]#####`);
                                                                    else
                                                                        console.log(`#####EVENTUPDATE[PROCESSING_NO_ID()]#####`);
                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });
                                            else if (prop === 'put' && context === 'create')
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === articlesTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function (response) {
                                                                    if (response.data && response.data.Item && response.data.Item.slug)
                                                                        console.log(`#####EVENTUPDATE[PUBLISHED_ARTICLE(${response.data.Item.slug},${response.data.Item.author})]#####`);
                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });
                                            else if (prop === 'put' && context === 'favorite')
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === articlesTable &&
                                                            workingArticle.favoritesCount < argumentsList[0].Item.favoritesCount)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function (response) {
                                                                    if (response.data && response.data.Item && response.data.Item.slug)
                                                                        console.log(`#####EVENTUPDATE[FAVED(${response.data.Item.slug},${workingArticle.favoritedBy ? argumentsList.Item.favoritedBy.find(item => !workingArticle.favoritedBy.includes(item)) : response.data.Item.favoritedBy[0]})]#####`);
                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });
                                            // else if (prop === 'put' && context === 'update')
                                            else if (prop === 'delete' && context === 'update') {
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === articlesTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function () {
                                                                        console.log(`#####EVENTUPDATE[DELETED_ARTICLE(${argumentsList[0].Key}, ${workingArticle.author})]#####`);
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

module.exports.create = recorder.createRecordingHandler('src/Article.js', 'create', mock, false, updateContext);
module.exports.get = recorder.createRecordingHandler('src/Article.js', 'get', mock, false, updateContext);
module.exports.update = recorder.createRecordingHandler('src/Article.js', 'update', mock, false, updateContext);
module.exports.delete = recorder.createRecordingHandler('src/Article.js', 'delete', mock, false, updateContext);
module.exports.favorite = recorder.createRecordingHandler('src/Article.js', 'favorite', mock, false, updateContext);
module.exports.list = recorder.createRecordingHandler('src/Article.js', 'list', mock, false, updateContext);
module.exports.getFeed = recorder.createRecordingHandler('src/Article.js', 'getFeed', mock, false, updateContext);
module.exports.getTags = recorder.createRecordingHandler('src/Article.js', 'getTags', mock, false, updateContext);
