#! /bin/bash

export resdir=results`date +%Y%m%d%H%M%S`
mkdir ${resdir}

export API_URL=`serverless info --verbose | grep '^ServiceEndpoint:' | grep -o 'https://.*'`
export API_URL=$API_URL/api

echo ${API_URL}

for parrun in $(seq 1 250)
do
    export curr_resdir=${resdir}/rec-res-${parrun}
    mkdir ${curr_resdir}

    node wt-scripts/run-interleave-test.js &> ${curr_resdir}/run-output &
    # sleep 0.5

    unset curr_resdir

done

sleep 20

node watchtower-analysis-scripts/interleavings-report.js &> ${resdir}/report
