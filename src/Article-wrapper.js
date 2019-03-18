const recorder = require('watchtower-recorder');

const Util = require('./Util');
const usersTable = Util.getTableName('users');

// Loading modules that fail when required via vm2
const aws      = require('aws-sdk');
const jws      = require('jws');

const mock = {
    // './Util' : Util,
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
					    if (prop == 'get')
						return new Proxy(obj[prop],{
						    apply: function(target, thisArg, argumentsList) {
							if (argumentsList[0].TableName === usersTable)
							    return target.apply(thisArg, argumentsList)
							    .on('success', function(response) {
								if (response.data && response.data.Item && response.data.Item.uuid)
								    console.log(`#####EVENTUPDATE[PROCESSING_DATA(${response.data.Item.uuid})]#####`);
								else
								    console.log(`#####EVENTUPDATE[PROCESSING_NO_ID()]#####`);
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

module.exports.create = recorder.createRecordingHandler('src/Article.js', 'create' , mock);
module.exports.get = recorder.createRecordingHandler('src/Article.js', 'get' , mock);
module.exports.update = recorder.createRecordingHandler('src/Article.js', 'update' , mock);
module.exports.delete = recorder.createRecordingHandler('src/Article.js', 'delete' , mock);
module.exports.favorite = recorder.createRecordingHandler('src/Article.js', 'favorite' , mock);
module.exports.list = recorder.createRecordingHandler('src/Article.js', 'list' , mock);
module.exports.getFeed = recorder.createRecordingHandler('src/Article.js', 'getFeed' , mock);
module.exports.getTags = recorder.createRecordingHandler('src/Article.js', 'getTags' , mock);
