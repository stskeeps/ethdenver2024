FROM ubuntu:jammy AS build

WORKDIR /opt/cartesi/dapp
COPY go.mod ./go.mod
COPY go.sum ./go.sum
COPY main.go ./main.go
RUN apt-get update && apt-get install --no-install-recommends -y ca-certificates build-essential curl
RUN curl -L https://go.dev/dl/go1.22.0.linux-$(uname -m | sed "s|x86_64|amd64|g" | sed "s|aarch64|arm64|g").tar.gz | tar -C / -zxf -
RUN /go/bin/go mod tidy
RUN GOOS=linux GOARCH=riscv64 /go/bin/go build

FROM --platform=linux/riscv64 ghcr.io/stskeeps/node:20-jammy-slim-estargz
COPY --from=build /opt/cartesi/dapp/main /opt/cartesi/dapp/main
ENV ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004"

ENTRYPOINT  ["/opt/cartesi/dapp/main", "6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5", "1"]
