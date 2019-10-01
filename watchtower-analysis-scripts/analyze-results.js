const fs = require('fs');
const dir = process.argv[2];
const files = fs.readdirSync(dir);

let results;
results = files.
    map(file => fs.readFileSync(`${dir}/${file}`)).
    map(res => JSON.parse(res));
results = [].concat(...results);
results = results.filter(res => res.isInit);

const sum = results.map(res => Number(res.runTime)).reduce(function(a, b) { return a + b; });
const avg = sum/results.length;


console.log(sum);
console.log(avg);

