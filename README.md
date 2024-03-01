# ETHDenver 2024 - VeriFido

VeriFido is an ETHDenver 2024 hackathon project that produces **verifiable Ethereum indexing**.

Its end game is to allow something like TheGraph to execute in a deterministic, decentralized, and verifiable environment. This way, its resulting indexing data can be disputable on-chain!

To make that possible, this project leverages the Cartesi Machine and Optimism's Pre-image Oracle.

## Why verifiable indexing?

At the time of writing, this is the basic workflow of most Ethereum-based applications:

![indexing architecture](./architecture-indexing.png)

As displayed above, the status quo for indexing services is that they are either centralized or decentralized but unverifiable. This means that, although reasonably secure, indexing services still need to rely on human intervention for arbitrating any misbehavior.

While this does not represent a direct risk to user assets, it does leave a door open for tricking users into taking bad decisions based on false information that is shown to them.

## VeriFido architecture

TODO

## Components

## Running

Start the Cartesi Lambada devkit.

- For amd64 systems, execute:

```shell
docker run -e KECCAK256_SOURCE=http://web3.link:8000 -p 8081:8081 -p 3033:3033 --privileged -it zippiehq/lambada-ethdenver-devkit-amd64:1.1
```

- For arm64 systems, execute:

```shell
docker run -e KECCAK256_SOURCE=http://web3.link:8000 -p 8081:8081 -p 3033:3033 --privileged -it zippiehq/lambada-ethdenver-devkit-arm64:1.1
```

Wait until it is up and running, after which it will print something like this:

```
===============================================================================
Now you can access the Cartesi development environment on http://localhost:8081

or

docker exec -it <container-id> /bin/bash
===============================================================================
```

Follow one of the two options to open a terminal within the devkit environment.

```shell
docker exec -it <container-id> /bin/bash
```

Once inside, clone this repo and `cd` into it:

```shell
git clone https://github.com/stskeeps/ethdenver2024
cd ethdenver2024
```

Then, build the application and start it up:

```shell
cartesi-build
```

This will take some time, after which it will print the following info:

```
Done! Chain CID is <cid>

You can now make your Lambada node:
- subscribe to your chain with: curl http://127.0.0.1:3033/subscribe/<cid>
- send a transaction to your chain: curl -X POST -d 'transaction data' -H "Content-type: application/octet-stream" http://127.0.0.1:3033/submit/<cid>
- read latest state CID: curl http://127.0.0.1:3033/latest/<cid>
```

To ask the application to update the Gravatar index, first subscribe and then submit arbitrary data to it by calling the `submit` endpoint as described above.

You may find application logs in `/tmp/cartesi-machine.logs`.

## Advanced: run dehashing server using Optimism's pre-image Oracle

### Cloning submodules

Make sure the appropriate optimism fork is cloned as a submodule:

```shell
git submodule update --init
```

### Build Optimism fork

```shell
docker build -t opstack:cartesi -f ./optimism/ops/docker/op-stack-go/Dockerfile ./optimism
```

### Build and run dehashing server

```shell
docker build ./dehashing-server -t dehashing-server
docker run -p 8000:8000 -e ALCHEMY_RPC_URL=<alchemy-rpc-url> dehashing-server
```

Replace `<alchemy-rpc-url>` with a Sepolia Alchemy RPC URL.

### Query block hash

The following queries for block `6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5` from sepolia.

```shell
curl "http://localhost:8000/hint/l1-block-header%200x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5"
curl "http://localhost:8000/dehash/6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5" | xxd
```
