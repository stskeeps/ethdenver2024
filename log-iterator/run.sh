#!/bin/bash

/opt/cartesi/dapp/main &

while [ ! -f /tmp/main.pid ]; do
	echo Waiting for main.pid 
	sleep 1
done
sleep 1

curl http://127.0.0.1:5004/get_tx

curl --request POST \
     --url http://127.0.0.1:8545  \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getLogs",
  "params": [
    {
      "blockHash": "0x042a693532aabb52c66b0f5ea77026e4d0f2167661f8041b9ba214fe47e1def2",
      "address": [
        "0xFF6FAeFbC046Db7F49A2Ad9db0b2EA8eDfBe64f7"
      ],
      "topics": [
      ]
    }
  ]
}
'
sleep 10

if [ $? != 0 ]; then
  curl -X POST http://127.0.0.1:5004/exception
else
  curl -X POST http://127.0.0.1:5004/finish
fi

exit 0
# never reaches here

curl --request POST \
     --url http://127.0.0.1:8545 \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_blockNumber"
}
'

curl --request POST \
     --url http://127.0.0.1:8545 \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getBlockByHash",
  "params": [
    "0x042a693532aabb52c66b0f5ea77026e4d0f2167661f8041b9ba214fe47e1def2",
    false
  ]
}
'

curl --request POST \
     --url http://127.0.0.1:8545 \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getBlockByNumber",
  "params": [
    "0x52249B",
    false
  ]
}
'

sleep 30

