async function main() {
    const scripts = require('watchtower-anaysis-scripts');
    const storedData = await scripts.getTTLdTableItems('eu-west-1','Watchtower-dev-MonitoredEvents');

    console.log(`Total item count: ${storedData.allItems.length}. Deleted item count: ${storedData.deletedItems.length}`)
}

main();
