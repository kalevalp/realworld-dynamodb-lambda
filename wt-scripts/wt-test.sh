#! /bin/bash

export resdir=results`date +%Y%m%d%H%M%S`
mkdir ${resdir}

function run {
    serverless deploy
    sleep 10
    serverless deploy
    sleep 10
    serverless deploy
    sleep 30

    for j in $(seq 1 5)
    do
	for i in $(seq 1 5)
	do
	    npm run test:deployed
	    sleep 5
	done
	echo Iteration ${j} &>> ${curr_resdir}/ddb-usage
	node analyze-ddb-use.js &>> ${curr_resdir}/ddb-usage
    done

    # node get-wt-times.js ${curr_resdir}/

    serverless remove
}

# export WT_RUN_NO_RECORDING=''

# export curr_resdir=${resdir}/no-rec-res
# mkdir ${curr_resdir}
# run &> ${curr_resdir}/run-output

# unset WT_RUN_NO_RECORDING
# unset curr_resdir

# for pcount in $(seq 1 2 9)
# do

export pcount=9
export curr_resdir=${resdir}/rec-res-${pcount}-props
mkdir ${curr_resdir}

export WT_RW_PROP_COUNT=${pcount}

run &> ${curr_resdir}/run-output

unset WT_RW_PROP_COUNT
unset curr_resdir
# done
