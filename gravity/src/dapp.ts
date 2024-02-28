import { Hex } from "viem";
import * as gravatar from "./gravatar";
import * as blocks from "./blocks";

export const updateIndex = async (blockHash: Hex) => {
    console.log(
        "Updating index based on block hash " + JSON.stringify(blockHash),
    );
    // fetch all blocks from last processed block to specified block
    const fetched = await blocks.fetchBlockRange(blockHash);

    for (const block of fetched) {
        const logs = await gravatar.fetchLogs(block.hash);
        for (const log of logs) {
            await gravatar.handleEvent(log.eventName, log.args);
        }
    }
    return "accept";
};
