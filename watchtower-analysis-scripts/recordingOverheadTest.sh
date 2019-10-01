#! /bin/bash

iter=0;
totaliter=0;

while 
    [ $iter -lt 5 ]
do
    echo "iteration" $totaliter
    pushd ../
    sls deploy -v

    if
        npm run test:deployed ; 
    then       
        echo "successful run" $iter
        iter=$(( $iter + 1 ))
        popd
        node function-execution-times.js 
        pushd ../
    else        
        echo "failed run"
    fi
    sls remove -v
    popd 
    
    totaliter=$(( $totaliter + 1 ))
            
    if
        [ $totaliter -ge 10 ]
    then
        echo "Exceeded number of attempts!"
        exit -1
    fi
done
