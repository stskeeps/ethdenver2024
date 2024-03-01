#!/bin/bash

set -e

/opt/cartesi/jsonrpc/main &

while [ ! -f /tmp/main.pid ]; do
	echo Waiting for main.pid 
	sleep 1
done
sleep 1

curl -sSL http://127.0.0.1:5004/get_tx > /dev/null

echo STARTING APP

cd /opt/cartesi/dapp
node dist/index.js

if [ $? != 0 ]; then
  echo EXIT APP AS EXCEPTION
  curl -X POST http://127.0.0.1:5004/exception
else
  echo EXIT APP AS FINISH
  curl -X POST http://127.0.0.1:5004/finish
fi

sleep 1

exit 0
