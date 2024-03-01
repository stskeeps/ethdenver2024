FROM ubuntu:jammy AS build-jsonrpc

WORKDIR /opt/cartesi/jsonrpc
COPY log-iterator/go.mod ./go.mod
COPY log-iterator/go.sum ./go.sum
COPY log-iterator/main.go ./main.go
RUN apt-get update && apt-get install --no-install-recommends -y ca-certificates build-essential curl
RUN curl -L https://go.dev/dl/go1.22.0.linux-$(uname -m | sed "s|x86_64|amd64|g" | sed "s|aarch64|arm64|g").tar.gz | tar -C / -zxf -
RUN /go/bin/go mod tidy
RUN GOOS=linux GOARCH=riscv64 /go/bin/go build -ldflags "-s -w"

FROM node:20 AS build-dapp

WORKDIR /opt/cartesi/dapp
COPY gravity/package.json .
COPY gravity/tsconfig.json .
COPY gravity/yarn.lock .
COPY gravity/src ./src
RUN yarn
RUN yarn build

FROM --platform=linux/riscv64 ghcr.io/stskeeps/node:20-jammy-slim-estargz
RUN apt-get update && apt-get install --no-install-recommends -y curl
COPY --from=build-jsonrpc /opt/cartesi/jsonrpc/main /opt/cartesi/jsonrpc/main
COPY --from=build-dapp /opt/cartesi/dapp /opt/cartesi/dapp
COPY ./run.sh /run.sh
RUN chmod +x /run.sh

ENV ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004"
ENV GRAVATAR_ADDRESS="0x08d08e320e2b25184173331FcCCa122E4129523f"
ENV GENESIS_BLOCK_HASH="0xfe986bc4da97cc2f9ee09ede3e4aa773b6d982e3e2802f29b221cd02c246b531"

ENTRYPOINT  ["/run.sh"]
