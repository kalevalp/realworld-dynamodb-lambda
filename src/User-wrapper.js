const recorder = require('watchtower-recorder');

// Loading modules that fail when required via vm2
const aws      = require('aws-sdk');
const jws      = require('jws');

const cipherTableName = process.env.CIPHERS_TABLE;

const mock = {
    'aws-sdk' : aws,
    'jws'     : jws,
};

module.exports.create = recorder.createRecordingHandler('src/User.js', 'create' , mock);
module.exports.get = recorder.createRecordingHandler('src/User.js', 'get' , mock);
module.exports.delete = recorder.createRecordingHandler('src/User.js', 'delete' , mock);
module.exports.login = recorder.createRecordingHandler('src/User.js', 'login', mock);
module.exports.update = recorder.createRecordingHandler('src/User.js', 'update', mock);
module.exports.getProfile = recorder.createRecordingHandler('src/User.js', 'getProfile', mock);
module.exports.authenticateAndGetUser = recorder.createRecordingHandler('src/User.js', 'authenticateAndGetUser', mock);
module.exports.getUserByUsername = recorder.createRecordingHandler('src/User.js', 'getUserByUsername', mock);
module.exports.getProfileByUsername = recorder.createRecordingHandler('src/User.js', 'getProfileByUsername', mock);
module.exports.follow = recorder.createRecordingHandler('src/User.js', 'follow', mock);
module.exports.getFollowedUsers = recorder.createRecordingHandler('src/User.js', 'getFollowedUsers', mock);
