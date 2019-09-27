const log_scraper = require('cloudwatch-log-scraper');

const scraper = new log_scraper.LogScraper('us-east-1');

async function main() {

    const lgs = await scraper.getAllLogGroups();
    const monitorLog = lgs.find(item => item.match(/watchtower-monitor/));
    const logElements = await scraper.getAllLogItemsForGroup(monitorLog);       
    const violationLog = logElements.filter(x => x.message.match(/Property .* was violated/));
    const createArticleLogGroup = lgs.find(item => item.match(/createArticle/));
    const articleCreateLog = await scraper.getAllLogItemsForGroup(createArticleLogGroup);
    const articleCreateEvents = articleCreateLog.filter(x => x.message.match(/EVENTUPDATE/));

    const violatingInvocationRE = /Failure triggered by event produced by Lambda invocation ([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/;

    for (const violation of violationLog) {       
        const violationDetails = violation.message.match(violatingInvocationRE)[1]
        
        const violatingEvent = articleCreateEvents.find(x => x.message.match(violationDetails))
        console.log(`Time of violating event: ${violatingEvent.timestamp}, time of violation detection: ${violation.timestamp}, delay: ${violation.timestamp-violatingEvent.timestamp}(ms).`);
    }

    // console.log(articleCreateLog.filter(x => x.message.match(/EVENTUPDATE/)));
}

main();
