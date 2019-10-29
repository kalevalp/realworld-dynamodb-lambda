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

const UtilMock = {
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
					    if (debug) console.log("In follow, DynamoDB.DocumentClient.<x>, x is:", JSON.stringify(prop));
                                            if (prop === 'get') {
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
							if (debug) console.log("In follow, DynamoDB.DocumentClient.get, argumentsList is:", JSON.stringify(argumentsList));
                                                        if (argumentsList[0].TableName === usersTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function (response) {
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
                                                                    }
                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });
                                            } else if (prop === 'put') {
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
							if (debug) console.log("In follow, DynamoDB.DocumentClient.put, argumentsList is:", JSON.stringify(argumentsList));
                                                        if (argumentsList[0].TableName === usersTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function () {
                                                                    if (context === 'follow' && argumentsList[0].Item.username === follower.username) { // Follower put is notification point.
                                                                        if (!follower.following || !follower.following.values || !follower.following.values.includes(followee.username)) {
                                                                            eventPublisher({name: "UNFOLLOWED", params: {user_uuid: follower.username,
															 author_uuid: followee.username}},
											   lambdaExecutionContext);
                                                                        } else {
                                                                            eventPublisher({name: "FOLLOWED", params: {user_uuid: follower.username,
														       author_uuid: followee.username}},
											   lambdaExecutionContext);
                                                                        }
                                                                    }
                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });
					    } else {
                                                return obj[prop];
					    }
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
			    eventPublisher({name: "LOGGED_IN", params: {user_uuid: argumentsList[0].user.username}},
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
