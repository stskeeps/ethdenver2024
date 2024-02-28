import * as blocks from "../src/blocks";
import { expect, test } from "vitest";

test("dummy", async () => {
    return;
});

if (process.env.TEST_LIVE) {
    test("fetch blocks", async () => {
        console.log("la");
        const result = await blocks.fetchBlockRange(
            "0x5d5cffb4a2e11140ba1d20bda13306103c705a4c70816860c1e6a93a7bce04ce",
        );
        const blockNumbers = result.map((b) => b.number);
        console.log(blockNumbers);
        expect(blockNumbers).toEqual([7426647n, 7426646n, 7426645n]);
    });
}
