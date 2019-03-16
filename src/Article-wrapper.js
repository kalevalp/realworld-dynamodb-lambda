const recorder = require('watchtower-recorder');

// Loading modules that fail when required via vm2
const aws      = require('aws-sdk');
const jws      = require('jws');

const cipherTableName = process.env.CIPHERS_TABLE;

const mock = {
    'aws-sdk' : aws,
    'jws'     : jws,
};

module.exports.create = recorder.createRecordingHandler('src/Article.js', 'create' , mock);
module.exports.get = recorder.createRecordingHandler('src/Article.js', 'get' , mock);
module.exports.update = recorder.createRecordingHandler('src/Article.js', 'update' , mock);
module.exports.delete = recorder.createRecordingHandler('src/Article.js', 'delete' , mock);
module.exports.favorite = recorder.createRecordingHandler('src/Article.js', 'favorite' , mock);
module.exports.list = recorder.createRecordingHandler('src/Article.js', 'list' , mock);
module.exports.getFeed = recorder.createRecordingHandler('src/Article.js', 'getFeed' , mock);
module.exports.getTags = recorder.createRecordingHandler('src/Article.js', 'getTags' , mock);
