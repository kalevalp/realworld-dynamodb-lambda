const recorder = require('watchtower-recorder');

// Loading modules that fail when required via vm2
const aws      = require('aws-sdk');

const mock = {
    'aws-sdk' : aws,
};

module.exports.ping = recorder.createRecordingHandler('src/Util.js', 'ping' , mock);
module.exports.purgeData = recorder.createRecordingHandler('src/Util.js', 'purgeData' , mock);
module.exports.getTableName = recorder.createRecordingHandler('src/Util.js', 'getTableName' , mock);
module.exports.envelop = recorder.createRecordingHandler('src/Util.js', 'envelop' , mock);
