const fs = require('fs')
const reportFile = process.argv[2];

const reports = JSON.parse(fs.readFileSync(reportFile));

const potentialViolationRE = /Property (.*) was$ POTENTIALLY violated for property instance (.*)\. Failure triggered by event produced by Lambda invocation (.*)\./;
const violationRE = /Property (.*) was violated for property instance (.*)\. Failure triggered by event produced by Lambda invocation (.*)\./;
const holdsRE = /Property (.*) holds for property instance (.*)}/;
const inconclusiveRE = /Property (.*) was not violated (but might be violated by future events) for property instance (.*)/;

const potentialFails = reports.filter(rep => rep.match(potentialViolationRE));
const violations = reports.filter(rep => rep.match(violationRE));
const holds = reports.filter(rep => rep.match(holdsRE));
const inconclusives = reports.filter(rep => rep.match(inconclusiveRE));

console.log( "Potential fails: ", potentialFails.length );
console.log( "Violations: ", violations.length );
console.log( "Property holds: ", holds.length );
console.log( "Inconclusive check: ", inconclusives.length );
