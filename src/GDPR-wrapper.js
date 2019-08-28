const recorder = require('watchtower-recorder');

const Util = require('./Util');
const GDPRConsentTable = Util.getTableName('gdpr-consent');

// Loading modules that fail when required via vm2
const aws      = require('aws-sdk');
const jws      = require('jws');

const mock = {
    'aws-sdk' : new Proxy(aws,{
	get: function(obj, prop) {
            if (prop === "DynamoDB")
		return new Proxy(obj[prop],{
		    get: function(obj, prop) {
			if (prop === "DocumentClient")
			    return new Proxy(obj[prop],{
				construct: function (target, args) {
 			    	    return new Proxy(new target(...args), {
					get: function(obj, prop) {
					    if (prop == 'put')
						return new Proxy(obj[prop],{
						    apply: function(target, thisArg, argumentsList) {
							if (argumentsList[0].TableName === GDPRConsentTable)
							    return target.apply(thisArg, argumentsList)
							    .on('success', function(response) {
								console.log(`#####EVENTUPDATE[GOT_CONSENT(${argumentsList[0].Item.uuid})]#####`);
							    });
							else
							    return target.apply(thisArg, argumentsList);
						    },					    
						});
					    else if (prop == 'delete')
						return new Proxy(obj[prop],{
						    apply: function(target, thisArg, argumentsList) {
							if (argumentsList[0].TableName === GDPRConsentTable)
							    return target.apply(thisArg, argumentsList)
							    .on('success', function(response) {
								console.log(`#####EVENTUPDATE[REVOKED_CONSENT(${argumentsList[0].Key.uuid})]#####`);
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

module.exports.consent = recorder.createRecordingHandler('src/GDPR.js', 'consent' , mock);
module.exports.revoke = recorder.createRecordingHandler('src/GDPR.js', 'revoke' , mock);