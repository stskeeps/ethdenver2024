#!/bin/bash

set -e

/opt/cartesi/jsonrpc/main &

while [ ! -f /tmp/main.pid ]; do
	echo Waiting for main.pid 
	sleep 1
done
sleep 1

echo STARTING APP

cd /opt/cartesi/dapp
node dist/index.js 0x5fd72d79165dc9940882a1b9bb415bed4af94a349fbfdbcc5aea9abd1a06c49b

if [ $? != 0 ]; then
  echo EXIT APP AS EXCEPTION
  curl -X POST http://127.0.0.1:5004/exception
else
  echo EXIT APP AS FINISH
  curl -X POST http://127.0.0.1:5004/finish
fi

sleep 1

exit 0
