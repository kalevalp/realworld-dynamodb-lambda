const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);
const batchEventPublisher = recorder.createBatchEventPublisher(eventsStreamName);
const debug   = process.env.DEBUG_WATCHTOWER;

const Util = require('./Util');
const usersTable = Util.getTableName('users');
const articlesTable = Util.getTableName('articles');

// Loading modules that fail when required via vm2

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

const getProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === usersTable,
	opInSucc: (argumentsList) => (response) => {
	    if (context === 'getFeed') {
                workingUser = response.data.Item;
            }
            if (response.data && response.data.Item && response.data.Item.uuid)
                eventPublisher({name: "PROCESSING_DATA", params: {user: response.data.Item.uuid}},
			       lambdaExecutionContext);
	},
    },
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === articlesTable,
	opInSucc: (argumentsList) => (response) => {
            if (context === 'favorite' || context === 'delete') {
                workingArticle = response.data.Item !== undefined ? JSON.parse(JSON.stringify(response.data.Item)): response.data.Item;
            }
            if (context === 'get') {
                if (response.data && response.data.Item && response.data.Item.slug)
                    eventPublisher({name: "RETRIEVED_ARTICLE", params: {article_slug: response.data.Item.slug}},
				   lambdaExecutionContext);
            }
	},
    },
]

const putProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => context === 'create' && argumentsList[0].TableName === articlesTable,
	opInSucc: (argumentsList) => (response) => {
            eventPublisher({name: "PUBLISHED_ARTICLE", params: {article_slug: argumentsList[0].Item.slug,
								user: argumentsList[0].Item.author}},
			   lambdaExecutionContext);
	},
    },
    {
	cond: (target, thisArg, argumentsList) => context === 'favorite' && (argumentsList[0].TableName === articlesTable && ( !workingArticle.favoritesCount || workingArticle.favoritesCount < argumentsList[0].Item.favoritesCount )),
	opInSucc: (argumentsList) => (response) => {
            if (debug) console.log("In wrapper. put in context of favorite");
	    if (debug) console.log("Calling put. argumentsList is: ", JSON.stringify(argumentsList));
	    if (debug) console.log("Calling put. Working article is: ", JSON.stringify(workingArticle));
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
	}
    }
]
const deleteProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === articlesTable,
	opInSucc: (argumentsList) => (response) => {
            eventPublisher({name: "DELETED_ARTICLE", params: {article_slug: argumentsList[0].Key.slug,
							      user: workingArticle.author}},
			   lambdaExecutionContext);
	}
    },
]

const queryProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === articlesTable && ['getFeed', 'list'].includes(context),
	opInSucc: (argumentsList) => (response) => {
            if (response.data.Items.length > 0) {
                if (context === 'getFeed') {
                    const logEvents = response.data.Items.map(article => ({name: "IN_FEED", params: {article_slug: article.slug,
								                                     user: article.author,
								                                     reader: workingUser.username}}));
                    batchEventPublisher(logEvents,lambdaExecutionContext);
                } else { // context === 'list'
                    const logEvents = response.data.Items.map(article => ({name: "LISTED", params: {article_slug: article.slug}}))
                    batchEventPublisher(logEvents,lambdaExecutionContext);
                }
            }
	}
    },
]

const mock = {
    // './Util' : Util,
    'aws-sdk' : recorder.createDDBDocClientMock(getProxyConditions, putProxyConditions, deleteProxyConditions, queryProxyConditions),
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
