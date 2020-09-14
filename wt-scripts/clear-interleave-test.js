const aws = require('aws-sdk');
aws.config.update({region: 'eu-west-1'});
const dynamodb = new aws.DynamoDB();
const cloudwatchlogs = new aws.CloudWatchLogs();

async function getKeysFromTable(tableName, hashkey, sortkey) {
    const params = {
        ExpressionAttributeNames: {
            "#HASHKEY": hashkey,
        },
        TableName: tableName,
    };

    if (sortkey) {
        params.ExpressionAttributeNames['#SORTKEY'] = sortkey;
        params.ProjectionExpression = "#HASHKEY, #SORTKEY";

    } else {
        params.ProjectionExpression = "#HASHKEY";
    }

    let results;
    let keys = [];

    do {
        results = await dynamodb.scan(params).promise();
        keys.push(...results.Items.map(item => item));

        if (results.LastEvaluatedKey) {
            params.ExclusiveStartKey = results.LastEvaluatedKey;
        }
    } while (results.LastEvaluatedKey);

    return keys
}

async function deleteItemsFromTable(tableName, keys) {
    const valuesListList = [];

    for (let i = 0; i < keys.length / 25; i++) {
        valuesListList.push(keys.slice(i*25, (i+1)*25));
    }

    return await Promise.all(valuesListList.map(valuesList => {
        const params = {
            RequestItems: {}
        };
        params.RequestItems[tableName] = valuesList.map(value => {
            const requestItem = {DeleteRequest: {Key: value}};
            // requestItem.DeleteRequest.Key[keyName] = {S: value};
            return requestItem;
        });
        return dynamodb.batchWriteItem(params).promise();
    }));
}

async function getLogStreams(groupName) {
    var params = {
        logGroupName: groupName,
    };

    return (await cloudwatchlogs.describeLogStreams(params).promise()).logStreams.map(item => item.logStreamName);

}

async function deleteStreams(group, streams) {
    for (const stream of streams) {
        const params = {
            logGroupName: group,
            logStreamName: stream,
        };
        await cloudwatchlogs.deleteLogStream(params).promise();
    }
}

async function main() {
    const slugs = await getKeysFromTable('realworld-dev-articles', 'slug');
    console.log("Got articles:", slugs);
    await deleteItemsFromTable('realworld-dev-articles', slugs);

    const comments = await getKeysFromTable('realworld-dev-comments', 'id');
    console.log("Got comments:", comments);
    await deleteItemsFromTable('realworld-dev-comments', comments);

    const users = await getKeysFromTable('realworld-dev-users', 'username');
    console.log("Got users:", users);
    await deleteItemsFromTable('realworld-dev-users', users);

    const instanceCP = await getKeysFromTable('Watchtower-dev-InstanceCheckpoints', 'propinst');
    console.log("Got instance checkpoints:", instanceCP);
    await deleteItemsFromTable('Watchtower-dev-InstanceCheckpoints', instanceCP);

    const events = await getKeysFromTable('Watchtower-dev-MonitoredEvents', 'propinst', 'id');
    console.log("Got events:", events);
    await deleteItemsFromTable('Watchtower-dev-MonitoredEvents', events);

    const streams = await getLogStreams('/aws/lambda/realworld-dev-watchtower-monitor');
    console.log("Got log streams:", streams);
    await deleteStreams('/aws/lambda/realworld-dev-watchtower-monitor', streams);

}

main();
