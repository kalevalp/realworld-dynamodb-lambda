const log_scraper = require('cloudwatch-log-scraper');

const scraper = new log_scraper.LogScraper('eu-west-1');

async function main() {

    const lgs = await scraper.getAllLogGroups();
    const realworldLogs = lgs.filter(item => item.match(/realworld-dev-/));

    for (const logGroup of realworldLogs) {
	const logElements = await scraper.getAllLogItemsForGroup(logGroup);
	const reportLog = logElements.filter(x => x.message.match(/REPORT RequestId:/));
	const runReportRE = /REPORT RequestId: ([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\tDuration: ([0-9]*\.[0-9]*) ms/;

	for (const logEvent of reportLog) {
	    const x = logEvent.message.match(runReportRE);
	    console.log(x[2]);
	}
    }



    // for (const violation of violationLog) {
    //     const violationDetails = violation.message.match(violatingInvocationRE)[1]

    //     const violatingEvent = articleCreateEvents.find(x => x.message.match(violationDetails))
    //     console.log(`Time of violating event: ${violatingEvent.timestamp}, time of violation detection: ${violation.timestamp}, delay: ${violation.timestamp-violatingEvent.timestamp}(ms).`);
    // }

    // console.log(articleCreateLog.filter(x => x.message.match(/EVENTUPDATE/)));
}

main();
