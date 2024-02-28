import * as blocks from "../src/blocks";
import { expect, test } from "vitest";
import { START_BLOCK_HASH } from "../src/store";

test("initial latest block", async () => {
    const latestBlock = await blocks.getLatestBlockHash();
    expect(latestBlock).toEqual(START_BLOCK_HASH);
});

test("update latest block", async () => {
    const newHash =
        "0xdf0d63101848a1c26da75b250530c52da4a512013b3367bbe0a2b301d4cde515";
    await blocks.updateLatestBlockHash(newHash);
    const latestBlock = await blocks.getLatestBlockHash();
    expect(latestBlock).toEqual(newHash);
});

if (process.env.TEST_LIVE) {
    test("fetch blocks", async () => {
        const result = await blocks.fetchBlockRange(
            "0x5d5cffb4a2e11140ba1d20bda13306103c705a4c70816860c1e6a93a7bce04ce",
        );
        const blockNumbers = result.map((b) => b.number);
        console.log(blockNumbers);
        expect(blockNumbers).toEqual([7426645n, 7426646n, 7426647n]);
    });
}
