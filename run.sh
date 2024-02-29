#!/bin/bash

set -e

/opt/cartesi/jsonrpc/main &

while [ ! -f /tmp/main.pid ]; do
	echo Waiting for main.pid 
	sleep 1
done
sleep 1

PAYLOAD=$(curl -sSL http://127.0.0.1:5004/get_tx)
BLOCK_HASH=$(echo $PAYLOAD | jq -r ".header.l1_finalized.hash")

cd /opt/cartesi/dapp
yarn start $BLOCK_HASH
