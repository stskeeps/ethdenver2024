import { Hex, createPublicClient, http } from "viem";
import { RPC_URL } from ".";

const INDEX_FROM_BLOCK =
    process.env.INDEX_FROM_BLOCK ||
    "0x59620400435e3555bd25fa51e60030ec82d9e1239cbe2beffba35dbe387be89e";

export const fetchBlockRange = async (blockHash: Hex) => {
    const fromBlock = INDEX_FROM_BLOCK;
    const client = createPublicClient({ transport: http(RPC_URL) });
    let blocks: any[] = [];
    while (blockHash && blockHash !== fromBlock) {
        const block = await client.getBlock({ blockHash });
        if (!block) {
            break;
        }
        blocks.push(block);
        blockHash = block.parentHash;
    }
    return blocks;
};
