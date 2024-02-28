import { Hex } from "viem";
import * as gravatar from "./gravatar";
import * as blocks from "./blocks";

export const updateIndex = async (blockHash: Hex) => {
    console.log(
        "Updating index based on block hash " + JSON.stringify(blockHash),
    );
    // fetch all blocks from last processed block to specified block
    const fetched = await blocks.fetchBlockRange(blockHash);

    let latestBlock: Hex = blockHash;
    for (const block of fetched) {
        latestBlock = block.hash;
        const logs = await gravatar.fetchLogs(latestBlock);
        for (const log of logs) {
            await gravatar.handleEvent(log.eventName, log.args);
        }
    }
    // update latest processed block
    await blocks.updateLatestBlockHash(latestBlock);
    return "accept";
};
