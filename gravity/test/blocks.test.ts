import * as blocks from "../src/blocks";
import { expect, test } from "vitest";

test("fetch blocks", async () => {
    const result = await blocks.fetchBlockRange(
        "0x5d5cffb4a2e11140ba1d20bda13306103c705a4c70816860c1e6a93a7bce04ce",
    );
    console.log(result.map((b) => b.number));
});
