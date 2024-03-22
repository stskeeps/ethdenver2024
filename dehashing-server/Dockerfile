FROM opstack:cartesi

ADD . /home

WORKDIR /home
EXPOSE 8000

CMD [ "/bin/sh", "-c", \
    "op-program --server --log.level trace --l1 $ALCHEMY_RPC_URL --l1.rpckind alchemy --l1.trustrpc --l1.head $HEAD_BLOCK_HASH --api.address 0.0.0.0:8000" \
]