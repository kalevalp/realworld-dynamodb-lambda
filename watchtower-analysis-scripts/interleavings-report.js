const log_scraper = require('cloudwatch-log-scraper');
const fs = require('fs');

const scraper = new log_scraper.LogScraper('eu-west-1');

function getRandFname() {
    const fiveDigitID = Math.floor(Math.random() * Math.floor(99999));
    return `runResults-${fiveDigitID}`;
}

async function main() {

    const filterExp = '?"@@@@WT_PROF: TOTAL CHECKED PATHS" ?"@@@@WT_PROF: MAXIMUM WIDTH"';

    const totalPathsRE = /@@@@WT_PROF: TOTAL CHECKED PATHS: (.*)/;
    const maxWidthRE = /@@@@WT_PROF: MAXIMUM WIDTH: (.*)/;

    const logGroup = '/aws/lambda/realworld-dev-watchtower-monitor';
    const logItems = await scraper.getAllLogItemsForGroupMatching(logGroup, filterExp);

    const paths = logItems.filter(item => item.message.match(totalPathsRE)).map(item => Number(item.message.match(totalPathsRE)[1]));
    const interleavedPaths = paths.filter(item => item > 1);
    console.log(`Total runs of the checker: ${paths.length}`);
    console.log(`Interleaved runs of the checker: ${interleavedPaths.length}`);
    console.log(`Interleaved runs proportion: ${(interleavedPaths.length / paths.length) * 100}`);
    console.log(`Average number of interleavings: ${(paths.reduce((acc, curr) => acc + curr, 0)) / paths.length}`);



    const width = logItems.filter(item => item.message.match(maxWidthRE)).map(item => Number(item.message.match(maxWidthRE)[1]));
    console.log(`Average maximum number of concurrent interleavings checked: ${width.reduce((acc, curr) => acc + curr, 0) / width.length}`);

    // console.log(width);

    // const fullReports = reports.map(rep =>
    //                                 [rep.eventOccuredTimestamp - rep.eventOccuredTimestamp,
    //                                  rep.eventKinesisArrivedTimestamp - rep.eventOccuredTimestamp,
    //                                  rep.ingestionFunctionStartTime - rep.eventOccuredTimestamp,
    //                                  rep.ddbWriteTime - rep.eventOccuredTimestamp,
    //                                  rep.instanceTriggerKinesisTime - rep.eventOccuredTimestamp,
    //                                  rep.checkerFunctionInvokeTime - rep.eventOccuredTimestamp,
    //                                  rep.violationDetectionTime - rep.eventOccuredTimestamp]
    //                                );

    // let outputfname = getRandFname();

    // if (process.argv[2]) {
    //     outputfname = process.argv[2];
    // }

    // fs.writeFileSync(outputfname, JSON.stringify(fullReports));
}

main();
