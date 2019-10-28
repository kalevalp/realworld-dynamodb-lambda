const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);

const Util = require('./Util');

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const jws = require('jws');

const usersTable = Util.getTableName('users');

let firstPhaseUserGet = true;
let follower;
let followee;

let context;
function updateContext(name) {
    context = name;
}

const mock = {
    './Util' : new Proxy(Util, {
        get: function (obj, prop) {
            if (prop === 'envelop')
                return new Proxy(obj[prop], {
                    apply: function (target, thisArg, argumentsList) {
                        if (context === 'login' && argumentsList[0] && argumentsList[0].user) {
			    eventPublisher({name: "LOGGED_IN", params: {user_uuid: argumentsList[0].user.username}});
                        }
                        return target.apply(thisArg, argumentsList);
                    }
                });
            else
                return obj[prop];
        }}),
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
                                                                    if (context === 'follow') {
                                                                        if (firstPhaseUserGet) {
                                                                            firstPhaseUserGet = false;
                                                                            follower = response.data.Item;
                                                                        } else {
                                                                            firstPhaseUserGet = true;
                                                                            followee = response.data.Item;
                                                                        }
                                                                    }
                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });
                                            else if (prop === 'put')
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === usersTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function () {
                                                                    if (context === 'follow' && argumentsList[0].Item.username === follower.username) { // Follower put is notification point.
                                                                        if (!follower.following.values || !follower.following.values.includes(followee.username)) {
                                                                            eventPublisher({name: "UNFOLLOWED", params: {user_uuid: follower.username,
															 author_uuid: followee.username}});
                                                                        } else {
                                                                            eventPublisher({name: "FOLLOWED", params: {user_uuid: follower.username,
														       author_uuid: followee.username}});
                                                                        }
                                                                    }
                                                                });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });

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

module.exports.create = recorder.createRecordingHandler('src/User.js', 'create', mock, false, updateContext);
module.exports.get = recorder.createRecordingHandler('src/User.js', 'get', mock, false, updateContext);
module.exports.delete = recorder.createRecordingHandler('src/User.js', 'delete', mock, false, updateContext);
module.exports.login = recorder.createRecordingHandler('src/User.js', 'login', mock, false, updateContext);
module.exports.update = recorder.createRecordingHandler('src/User.js', 'update', mock, false, updateContext);
module.exports.getProfile = recorder.createRecordingHandler('src/User.js', 'getProfile', mock, false, updateContext);
module.exports.authenticateAndGetUser = recorder.createRecordingHandler('src/User.js', 'authenticateAndGetUser', mock, false, updateContext);
module.exports.getUserByUsername = recorder.createRecordingHandler('src/User.js', 'getUserByUsername', mock, false, updateContext);
module.exports.getProfileByUsername = recorder.createRecordingHandler('src/User.js', 'getProfileByUsername', mock, false, updateContext);
module.exports.follow = recorder.createRecordingHandler('src/User.js', 'follow', mock, false, updateContext);
module.exports.getFollowedUsers = recorder.createRecordingHandler('src/User.js', 'getFollowedUsers', mock, false, updateContext);
