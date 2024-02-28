import { Hex } from "viem";
import { client } from "./client";
import { db } from "./store";

export const getLatestBlockHash = async () => {
    const result = (await db())
        .prepare(`SELECT blockHash FROM LatestBlock`)
        .getAsObject({});
    return result.blockHash as Hex;
};

export const updateLatestBlockHash = async (blockHash: Hex) => {
    (await db()).run(`UPDATE LatestBlock SET blockHash = '${blockHash}'`);
};

export const fetchBlockRange = async (blockHash: Hex) => {
    const latestBlockHash = await getLatestBlockHash();
    let blocks: any[] = [];
    while (blockHash && blockHash !== latestBlockHash) {
        const block = await client.getBlock({ blockHash });
        if (!block) {
            break;
        }
        blocks.push(block);
        blockHash = block.parentHash;
    }
    return blocks.reverse();
};
