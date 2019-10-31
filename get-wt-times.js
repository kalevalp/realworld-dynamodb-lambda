const scripts = require('watchtower-anaysis-scripts');

const outdir = process.argv[2];
console.log(outdir);
scripts.checkerRunTimes('eu-west-1','realworld-dev',`${outdir}/checker-times`);
scripts.ingestionRunTimes('eu-west-1','realworld-dev',`${outdir}/ingest-times`);
