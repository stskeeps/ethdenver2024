import { Block, Log, createPublicClient, custom } from "viem";

export const testClient = (data: { blocks: Block[]; logs: Log[] }) =>
    createPublicClient({
        transport: custom({
            request: async ({ method, params }) => {
                switch (method) {
                    case "eth_getLogs": {
                        const { address, blockHash } = params;
                        return data.logs.filter(
                            (log) =>
                                log.address === address &&
                                log.blockHash === blockHash,
                        );
                    }
                    case "eth_getBlockByHash":
                        const { hash } = params;
                        return data.blocks.find((block) => block.hash === hash);
                }
            },
        }),
    });
