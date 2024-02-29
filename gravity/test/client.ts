import { Block, Log, createPublicClient, custom, hexToBigInt } from "viem";

export const testClient = (data: {
    blocks: Partial<Block>[];
    logs: Partial<Log>[];
}) =>
    createPublicClient({
        transport: custom({
            request: async ({ method, params }) => {
                switch (method) {
                    case "eth_blockNumber": {
                        return data.blocks.reverse().at(0)?.number;
                    }
                    case "eth_getLogs": {
                        const { address, blockHash } = params[0];
                        return data.logs.filter(
                            (log) =>
                                log.address === address &&
                                log.blockHash === blockHash,
                        );
                    }
                    case "eth_getBlockByNumber": {
                        const [blockNumberStr] = params;
                        return data.blocks.find(
                            (block) =>
                                block.number === hexToBigInt(blockNumberStr),
                        );
                    }
                    case "eth_getBlockByHash": {
                        const [hash] = params;
                        return data.blocks.find((block) => block.hash === hash);
                    }
                }
            },
        }),
    });
