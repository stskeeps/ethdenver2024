# Dehashing device

## Build Optimism fork

```shell
git clone https://github.com/stskeeps/optimism
cd optimism
git checkout preimage-oracle-l2less
docker build -t opstack:cartesi -f ops/docker/op-stack-go/Dockerfile .
```

## Build and run dehashing server

```shell
docker build . -t dehashing-server

export ALCHEMY_RPC_URL=<alchemy-rpc-url>
docker run -p 8000:8000 -e ALCHEMY_RPC_URL=$ALCHEMY_RPC_URL dehashing-server
```

Replace `<alchemy-rpc-url>` with a Sepolia Alchemy RPC URL.

## Query block hash

The following queries for block `6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5` from sepolia.

```shell
curl "http://localhost:8000/hint/l1-block-header%200x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5"
curl "http://localhost:8000/dehash/6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5" | xxd
```
