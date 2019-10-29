const recorder = require('watchtower-recorder');
const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);

const Util = require('./Util');
const GDPRConsentTable = Util.getTableName('gdpr-consent');

// Loading modules that fail when required via vm2
const aws = require('aws-sdk');
const jws = require('jws');

let context;
let lambdaExecutionContext;
let lambdaInputEvent;
function updateContext(name, event, lambdaContext) {
    context = name;
    lambdaExecutionContext = lambdaContext;
    lambdaInputEvent = event;
}


const mock = {
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
                                            if (prop === 'put')
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === GDPRConsentTable)
                                                            return target.apply(thisArg, argumentsList)
                                                            .on('success', function () {
								eventPublisher({name: "GOT_CONSENT", params: {uuid: argumentsList[0].Item.uuid}},
									       lambdaExecutionContext);
                                                            });
                                                        else
                                                            return target.apply(thisArg, argumentsList);
                                                    },
                                                });
                                            else if (prop === 'delete')
                                                return new Proxy(obj[prop], {
                                                    apply: function (target, thisArg, argumentsList) {
                                                        if (argumentsList[0].TableName === GDPRConsentTable)
                                                            return target.apply(thisArg, argumentsList)
                                                                .on('success', function () {
                                                                    eventPublisher({name: "REVOKED_CONSENT", params: {uuid: argumentsList[0].Key.uuid}},
										   lambdaExecutionContext);
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

module.exports.consent = recorder.createRecordingHandler('src/GDPR.js', 'consent', mock, false, updateContext);
module.exports.revoke = recorder.createRecordingHandler('src/GDPR.js', 'revoke', mock, false, updateContext);
