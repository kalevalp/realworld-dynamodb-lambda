const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);
const batchEventPublisher = recorder.createBatchEventPublisher(eventsStreamName);
const debug   = process.env.DEBUG_WATCHTOWER;

const Util = require('./Util');
const usersTable = Util.getTableName('users');
const articlesTable = Util.getTableName('articles');

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const jws = require('jws');

let context;
let lambdaExecutionContext;
let lambdaInputEvent;
function updateContext(name, event, lambdaContext) {
    context = name;
    lambdaExecutionContext = lambdaContext;
    lambdaInputEvent = event;
}

let workingArticle;
let workingUser;

let ddbdcGetProxy;
function getDdbdcGetProxy(underlyingObj) {
    return new Proxy(underlyingObj, {
        apply: function (target, thisArg, argumentsList) {
            if (argumentsList[0].TableName === usersTable) {
                return target.apply(thisArg, argumentsList)
                .on('success', function (response) {
                    if (context === 'getFeed') {
                        workingUser = response.data.Item;
                    }
                    if (response.data && response.data.Item && response.data.Item.uuid)
                        eventPublisher({name: "PROCESSING_DATA", params: {user: response.data.Item.uuid}},
				       lambdaExecutionContext);
                });
            } else if (argumentsList[0].TableName === articlesTable) {
                return target.apply(thisArg, argumentsList)
                .on('success', function (response) {
                    if (context === 'favorite' || context === 'delete') {
                        workingArticle = response.data.Item !== undefined ? JSON.parse(JSON.stringify(response.data.Item)): response.data.Item;
                    }
                    if (context === 'get') {
                        if (response.data && response.data.Item && response.data.Item.slug)
                            eventPublisher({name: "RETRIEVED_ARTICLE", params: {article_slug: response.data.Item.slug}},
					   lambdaExecutionContext);
                    }
                });
            } else
                return target.apply(thisArg, argumentsList);
        },
    });
}

let ddbdcPutProxy;
function getDdbdcPutProxy(underlyingObj) {
    return new Proxy(underlyingObj, {
        apply: function (target, thisArg, argumentsList) {
            if (context === 'create') {
                if (argumentsList[0].TableName === articlesTable) {
                    return target.apply(thisArg, argumentsList)
                        .on('success', function (response) {
                            eventPublisher({name: "PUBLISHED_ARTICLE", params: {article_slug: argumentsList[0].Item.slug,
									        user: argumentsList[0].Item.author}},
				           lambdaExecutionContext);
                        });
                } else
                    return target.apply(thisArg, argumentsList);
            } else if (context === 'favorite') {
                if (debug) console.log("In wrapper. put in context of favorite");
		if (debug) console.log("Calling put. argumentsList is: ", JSON.stringify(argumentsList));
		if (debug) console.log("Calling put. Working article is: ", JSON.stringify(workingArticle));
                if (argumentsList[0].TableName === articlesTable &&
                    ( !workingArticle.favoritesCount || workingArticle.favoritesCount < argumentsList[0].Item.favoritesCount )) {
                    return target.apply(thisArg, argumentsList)
                    .on('success', function (response) {
			if (debug) console.log("Called put for un/fave, in 'on success'.");

			let favedUser;
			if (workingArticle.favoritedBy) {
			    favedUser = argumentsList[0].Item.favoritedBy.find(item =>
									       !workingArticle.favoritedBy.includes(item));
			} else {
			    favedUser = argumentsList[0].Item.favoritedBy[0];
			}
                        
                        eventPublisher({name: "FAVED", params: {article_slug: argumentsList[0].Item.slug,
								user: favedUser}},
				       lambdaExecutionContext);
                    });
                } else {
                    return target.apply(thisArg, argumentsList);
                }                
            } else {
                return target.apply(thisArg, argumentsList);
            }
        },
    });
}

let ddbdcDeleteProxy;
function getDdbdcDeleteProxy(underlyingObj) {
    return new Proxy(underlyingObj, {
        apply: function (target, thisArg, argumentsList) {
            if (argumentsList[0].TableName === articlesTable)
                return target.apply(thisArg, argumentsList)
                .on('success', function () {
                    eventPublisher({name: "DELETED_ARTICLE", params: {article_slug: argumentsList[0].Key.slug,
								      user: workingArticle.author}},
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
            if (argumentsList[0].TableName === articlesTable &&
                ['getFeed', 'list'].includes(context)) {
                return target.apply(thisArg, argumentsList)
                .on('success', function (response) {                    
                    if (context === 'getFeed') {
                        const logEvents = response.data.Items.map(article => ({name: "IN_FEED", params: {article_slug: article.slug,
								                                         user: article.author,
								                                         reader: workingUser.username}}));
                        batchEventPublisher(logEvents,lambdaExecutionContext);
                        
                    } else { // context === 'list'
                        const logEvents = response.data.Items.map(article => ({name: "LISTED", params: {article_slug: article.slug}}))
                        batchEventPublisher(logEvents,lambdaExecutionContext);
                    }
                });
            } else {
                return target.apply(thisArg, argumentsList);
            }
        },
    });
}


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
                                            if (prop === 'get') {
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
                                            } else if (prop === 'query') {
                                                if (!ddbdcQueryProxy) {
                                                    ddbdcQueryProxy = getDdbdcQueryProxy(obj[prop]);
                                                }
                                                return ddbdcQueryProxy;
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
