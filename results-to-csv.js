function getRandFname() {
    const fiveDigitID = Math.floor(Math.random() * Math.floor(99999));
    return `runResults-${fiveDigitID}`;
}

const readline = require('readline');
const fs = require('fs');

const fnameToRead = process.argv[2];

let fnameToWrite;

if (process.argv[3]) {
    fnameToWrite = process.argv[3];
} else {
    fnameToWrite = getRandFname();
}


const readInterface = readline.createInterface({
    input: fs.createReadStream(fnameToRead),
});

const lineRE = /\*\*\*\* Call ## ([0-9]*) ## Duration:  ([0-9]*)/

const collectedData = []

readInterface.on('line', function(line) {
    const m = line.match(lineRE)
    
    if (m) {
        const index = Number(m[1]);
        const runTime = Number(m[2]);
        
        if (!collectedData[index]) {
            collectedData[index] = [];
        }
        collectedData[index].push(runTime);
    }
}).on('close', () => {
    const rows = Math.max(...collectedData.map(col => col.length));
    
    const transp = [];

    for (let i = 0; i < rows; i++) {
        transp[i] = [];
        for (col of collectedData) {
            transp[i].push(col[i]);
        }
    }
    fs.writeFileSync(fnameToWrite, transp.map(row => row.join(',')).join('\n'));
});
