const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);
const debug   = process.env.DEBUG_WATCHTOWER;

const StrippedUtil = require('./Util');

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const jws = require('jws');

const usersTable = StrippedUtil.getTableName('users');

let firstPhaseUserGet = true;
let follower;
let followee;

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
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === usersTable,
	opInSucc: (argumentsList) => (response) =>  {
            if (context === 'follow') {
                if (firstPhaseUserGet) {
                    firstPhaseUserGet = false;
                    follower = response.data.Item;
		    if (debug) console.log("Follow proxy. got follower:", JSON.stringify(follower));
                } else {
                    firstPhaseUserGet = true;
                    followee = response.data.Item;
		    if (debug) console.log("Follow proxy. got followee:", JSON.stringify(followee));
                }
            } else if (context === 'getProfile') {
		if (debug) console.log("getProfile ddb.get response: ", JSON.stringify(response.data));
		if (response && response.data && response.data.Item && response.data.Item.uuid) {
		    eventPublisher({name: "PROCESSING_DATA", params: {user: response.data.Item.uuid}},
				   lambdaExecutionContext);
		}
	    }
	}
    },
];

const putProxyConditions = [
    {
	cond: (target, thisArg, argumentsList) => argumentsList[0].TableName === usersTable,
	opInSucc: (argumentsList) => (response) => {
	    if (context === 'follow' && argumentsList[0].Item.username === follower.username) { // Follower put is notification point.
                if (!follower.following || !follower.following.values || !follower.following.values.includes(followee.username)) {
                    eventPublisher({name: "UNFOLLOWED", params: {reader: follower.username,
								 user: followee.username}},
				   lambdaExecutionContext);
                } else {
                    eventPublisher({name: "FOLLOWED", params: {reader: follower.username,
							       user: followee.username}},
				   lambdaExecutionContext);
                }
            } else if (context === 'create') {
                eventPublisher({name: "LOGGED_IN", params: {user: argumentsList[0].Item.username}},
			       lambdaExecutionContext);
		eventPublisher({name: "GOT_CONSENT", params: {user: argumentsList[0].Item.uuid}},
			       lambdaExecutionContext);

	    }
	}
    },
];
const deleteProxyConditions = [];
const queryProxyConditions = [];

const UtilMock = {
    'aws-sdk' : recorder.createDDBDocClientMock(getProxyConditions, putProxyConditions, deleteProxyConditions, queryProxyConditions),
    'jws'     : jws,
};

const Util = recorder.recorderRequire('src/Util.js', UtilMock, false);

const LambdaMock = {
    './Util' : new Proxy(Util, {
        get: function (obj, prop) {
            if (prop === 'envelop') {
		if (debug) console.log("In Util wrapper. getting envelop.");
		if (debug) console.log("prop is: ", JSON.stringify(prop));
		if (debug) console.log("obj is: ", JSON.stringify(obj));
		if (debug) console.log("obj[prop] is undefined? ", obj[prop]===undefined);
		if (debug) console.log("envelop is: ", JSON.stringify(obj[prop]));
		if (debug) console.log("doing:");
                return new Proxy(StrippedUtil.envelop, {
                    apply: function (target, thisArg, argumentsList) {
			if (debug) console.log("In Util wrapper. calling envelop. argumentsList: ", JSON.stringify(argumentsList));

                        if (context === 'login' && argumentsList[0] && argumentsList[0].user) {
			    eventPublisher({name: "LOGGED_IN", params: {user: argumentsList[0].user.username}},
					   lambdaExecutionContext);
                        }
                        return target.apply(thisArg, argumentsList);
                    }
                });
            } else {
                return obj[prop];
	    }
        }}),
    'jws'     : jws,
};



module.exports.create = recorder.createRecordingHandler('src/User.js', 'create', LambdaMock, false, updateContext);
module.exports.get = recorder.createRecordingHandler('src/User.js', 'get', LambdaMock, false, updateContext);
module.exports.delete = recorder.createRecordingHandler('src/User.js', 'delete', LambdaMock, false, updateContext);
module.exports.login = recorder.createRecordingHandler('src/User.js', 'login', LambdaMock, false, updateContext);
module.exports.update = recorder.createRecordingHandler('src/User.js', 'update', LambdaMock, false, updateContext);
module.exports.getProfile = recorder.createRecordingHandler('src/User.js', 'getProfile', LambdaMock, false, updateContext);
module.exports.authenticateAndGetUser = recorder.createRecordingHandler('src/User.js', 'authenticateAndGetUser', LambdaMock, false, updateContext);
module.exports.getUserByUsername = recorder.createRecordingHandler('src/User.js', 'getUserByUsername', LambdaMock, false, updateContext);
module.exports.getProfileByUsername = recorder.createRecordingHandler('src/User.js', 'getProfileByUsername', LambdaMock, false, updateContext);
module.exports.follow = recorder.createRecordingHandler('src/User.js', 'follow', LambdaMock, false, updateContext);
module.exports.getFollowedUsers = recorder.createRecordingHandler('src/User.js', 'getFollowedUsers', LambdaMock, false, updateContext);
