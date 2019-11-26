const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);
const batchEventPublisher = recorder.createBatchEventPublisher(eventsStreamName);

const Util = require('./Util');
// Loading modules that fail when required via vm2
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

const getProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === commentsTable,
	opInSucc: (argumentsList) => (response) => { workingComment = response.data.Item; },
    },
]

const putProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === commentsTable,
	opInSucc: (argumentsList) => (response) => {
            eventPublisher({name: "COMMENTED", params: {article_slug: argumentsList[0].Item.slug,
							user: argumentsList[0].Item.author,
							comment_uuid:argumentsList[0].Item.id}},
			   lambdaExecutionContext);
	},
    },
]

const queryProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === commentsTable,
	opInSucc: (argumentsList) => (response) => {
	    if (response.data.Items.length > 0) {
                const logEvents = response.data.Items.map(comment => ({name: "RETRIEVED_COMMENT", params: {article_slug: comment.slug,
									                                   comment_uuid: comment.id}}));
                batchEventPublisher(logEvents,lambdaExecutionContext);
            }
	},
    },
]

const getProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === commentsTable,
	opInSucc: (argumentsList) => (response) => {
            eventPublisher({name:'DELETED_COMMENT', params: {article_slug: workingComment.slug,
							     comment_uuid: argumentsList[0].Key.id}},
			   lambdaExecutionContext);
	},
    },
]


const mock = {
    'aws-sdk' : recorder.createDDBDocClientMock(getProxyConditions, putProxyConditions, deleteProxyConditions, queryProxyConditions),
    'jws'     : jws,
};

module.exports.create = recorder.createRecordingHandler('src/Comment.js', 'create', mock, false, updateContext);
module.exports.get = recorder.createRecordingHandler('src/Comment.js', 'get', mock, false, updateContext);
module.exports.delete = recorder.createRecordingHandler('src/Comment.js', 'delete', mock, false, updateContext);
