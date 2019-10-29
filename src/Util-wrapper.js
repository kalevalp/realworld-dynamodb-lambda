const recorder = require('watchtower-recorder');

let context;
let lambdaExecutionContext;
let lambdaInputEvent;
function updateContext(name, event, lambdaContext) {
    context = name;
    lambdaExecutionContext = lambdaContext;
    lambdaInputEvent = event;
}


// Loading modules that fail when required via vm2
const aws      = require('aws-sdk');

const mock = {
    'aws-sdk' : aws,
};

module.exports.ping = recorder.createRecordingHandler('src/Util.js', 'ping' , mock, false, updateContext);
module.exports.purgeData = recorder.createRecordingHandler('src/Util.js', 'purgeData' , mock, false, updateContext);
module.exports.getTableName = recorder.createRecordingHandler('src/Util.js', 'getTableName' , mock, false, updateContext);
module.exports.envelop = recorder.createRecordingHandler('src/Util.js', 'envelop' , mock, false, updateContext);
