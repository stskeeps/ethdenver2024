import initSqlJs from "sql.js";
import { zeroAddress } from "viem";
import { describe, expect, test } from "vitest";

import { Application } from "../src/application";
import { testClient } from "./client";
import { GravatarDatabase } from "../src/db";

describe("application", () => {
    test("list empty", async () => {
        const SQL = await initSqlJs();
        const db = new SQL.Database();
        const gravatarDb = new GravatarDatabase(db, zeroAddress);
        const client = testClient({ blocks: [], logs: [] });
        const dapp = new Application(gravatarDb, client);
        expect(await dapp.db.count()).toEqual(0);
    });

    test("with 2 events", async () => {
        const SQL = await initSqlJs();
        const db = new SQL.Database();
        const gravatarDb = new GravatarDatabase(db, zeroAddress);

        // TODO: mock block and logs data so this test works
        const latestBlock =
            "0x5d5cffb4a2e11140ba1d20bda13306103c705a4c70816860c1e6a93a7bce04ce";

        const client = testClient({ blocks: [], logs: [] });
        /*await gravatar.handleEvent("NewGravatar", {
            id: 1n,
            owner: "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0335",
            displayName: "George",
            imageUrl: "https://no.where",
            blockHash:
                "0x5d5cffb4a2e11140ba1d20bda13306103c705a4c70816860c1e6a93a7bce04ce",
            blockNumber: 7426646n,
        });
        await gravatar.handleEvent("NewGravatar", {
            id: 2n,
            owner: "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0336",
            displayName: "John",
            imageUrl: "https://some.where",
            blockHash:
                "0x5d5cffb4a2e11140ba1d20bda13306103c705a4c70816860c1e6a93a7bce04ce",
            blockNumber: 7426646n,
        });*/

        const application = new Application(gravatarDb, client);
        await application.updateDb(latestBlock);

        const result1 = await application.db.get(1n);
        const result2 = await application.db.get(2n);
        expect(result1.displayName).toEqual("George");
        expect(result2.displayName).toEqual("John");
    });
});
