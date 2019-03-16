const recorder = require('watchtower-recorder');

// Loading modules that fail when required via vm2
const aws      = require('aws-sdk');
const jws      = require('jws');

const cipherTableName = process.env.CIPHERS_TABLE;

const mock = {
    'aws-sdk' : aws,
    'jws'     : jws,
};

module.exports.create = recorder.createRecordingHandler('src/Comment.js', 'create' , mock);
module.exports.get = recorder.createRecordingHandler('src/Comment.js', 'get' , mock);
module.exports.delete = recorder.createRecordingHandler('src/Comment.js', 'delete' , mock);
