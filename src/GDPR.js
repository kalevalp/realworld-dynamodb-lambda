const Util = require('./Util');
const GDPRConsentTable = Util.getTableName('gdpr-consent');

module.exports = {    
    async consent(event) {
        console.log(event);
        console.log(event.body);
        const body = JSON.parse(event.body);
        if (!body.uuid) {
            return Util.envelop('uuid must be specified.', 422);
        }
        
        const uuid = body.uuid;
        
        const consent = {
            uuid,
            createdAt : (new Date()).getTime(),           
        }

        await Util.DocumentClient.put({
            TableName: GDPRConsentTable,
            Item: consent,
        }).promise();

        return Util.envelop({ consent });
    },


    async revoke(event) {
        console.log(event);
        console.log(event.queryStringParameters);
        
        const uuid = event.queryStringParameters.uuid;

        await Util.DocumentClient.delete({
            TableName: GDPRConsentTable,
            Key: {
                uuid,
            }
        }).promise();

        return Util.envelop({});
    },
}
