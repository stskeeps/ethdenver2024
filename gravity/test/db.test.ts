import initSqlJs from "sql.js";
import { zeroAddress } from "viem";
import { describe, expect, test } from "vitest";

import { GravatarDatabase } from "../src/db.js";

describe("db", () => {
    test("empty", async () => {
        // create empty DB
        const SQL = await initSqlJs();
        const db = new SQL.Database();
        const gravatarDb = new GravatarDatabase(db, zeroAddress);

        expect(await gravatarDb.count()).toBe(0);
    });

    test("save", async () => {
        // create empty DB
        const SQL = await initSqlJs();
        const db = new SQL.Database();
        const gravatarDb = new GravatarDatabase(db, zeroAddress);
        const alice = {
            id: 1n,
            blockHash: zeroAddress,
            blockNumber: 1n,
            displayName: "Alice",
            imageUrl: "https://example.com/alice.png",
            owner: zeroAddress,
        };
        await gravatarDb.upsert(alice);

        expect(await gravatarDb.count()).toBe(1);
        const returned = await gravatarDb.get(1n);
        expect(returned).toEqual(alice);
    });
});
