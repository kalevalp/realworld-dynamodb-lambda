const log_scraper = require('cloudwatch-log-scraper');

const scraper = new log_scraper.LogScraper('eu-west-1');

async function main() {
    let lgs = await scraper.getAllLogGroups();
    // let events = await Promise.all(lgs.map(lg => scraper.getAllLogItemsForGroup(lg)));
    // events = [].concat(...events).filter((logItem) => logItem.message.match(/EVENTUPDATE/)).map(item => item.message).filter(item => !item.match(/PROCESSING_DATA/));
    // // console.log(events);
    // debugger;

    let events = await Promise.all(lgs.map(lg => scraper.getAllLogItemsForGroup(lg)));
    events = [].concat(...events).filter((logItem) => logItem.message.match(/\*\*\*\*\*\*\*\*\*\*\*\* Context is: /)).map(item => item.message);
    console.log(events);
    debugger;
}

main();
