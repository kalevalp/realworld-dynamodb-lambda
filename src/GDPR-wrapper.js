const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);

const Util = require('./Util');
const GDPRConsentTable = Util.getTableName('gdpr-consent');

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

const putProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === GDPRConsentTable,
	opInSucc: (argumentsList) => (response) => {
	    eventPublisher({name: "REVOKED_CONSENT", params: {user: argumentsList[0].Key.uuid}},
			   lambdaExecutionContext);
	}
    },
];
const deleteProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === GDPRConsentTable,
	opInSucc: (argumentsList) => (response) => {
	    eventPublisher({name: "GOT_CONSENT", params: {user: argumentsList[0].Item.uuid}},
			   lambdaExecutionContext)
	}
    },
];

const getProxyConditions = [];
const queryProxyConditions = [];

const mock = {
    'aws-sdk' : recorder.createDDBDocClientMock(getProxyConditions, putProxyConditions, deleteProxyConditions, queryProxyConditions),
    'jws'     : jws,
};

module.exports.consent = recorder.createRecordingHandler('src/GDPR.js', 'consent', mock, false, updateContext);
module.exports.revoke = recorder.createRecordingHandler('src/GDPR.js', 'revoke', mock, false, updateContext);
