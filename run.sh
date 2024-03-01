#!/bin/bash

set -e

/opt/cartesi/jsonrpc/main &

while [ ! -f /tmp/main.pid ]; do
	echo Waiting for main.pid 
	sleep 1
done
sleep 1

curl -sSL http://127.0.0.1:5004/get_tx

cd /opt/cartesi/dapp
yarn start
