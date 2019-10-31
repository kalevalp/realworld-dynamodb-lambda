const Util = require('./Util');
const GDPRConsentTable = Util.getTableName('gdpr-consent');

module.exports = {
    async consent(event) {
        console.log(event);
        console.log(event.body);
        const body = JSON.parse(event.body);
        if (!body.user) {
            return Util.envelop('user must be specified.', 422);
        }

        const user = body.user;

        const consent = {
            user,
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

        const user = event.queryStringParameters.user;

        await Util.DocumentClient.delete({
            TableName: GDPRConsentTable,
            Key: {
                user,
            }
        }).promise();

        return Util.envelop({});
    },
}
