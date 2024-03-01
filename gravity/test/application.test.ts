import initSqlJs from "sql.js";
import {
    encodeAbiParameters,
    encodeEventTopics,
    parseAbiParameters,
    zeroHash,
} from "viem";
import { describe, expect, test } from "vitest";

import { Application } from "../src/application.js";
import { testClient } from "./client.js";
import { GravatarDatabase } from "../src/db.js";
import gravatarAbi from "../src/gravatarAbi.js";

describe("application", () => {
    test("list empty", async () => {
        const gravatarAddress = "0x08d08e320e2b25184173331FcCCa122E4129523f";

        const SQL = await initSqlJs();
        const db = new SQL.Database();
        const gravatarDb = new GravatarDatabase(db);
        const client = testClient({ blocks: [], logs: [] });
        const dapp = new Application(
            gravatarDb,
            client,
            gravatarAddress,
            zeroHash,
        );
        expect(await dapp.db.count()).toEqual(0);
    });

    test("with 1 NewGravatar event and no blockHash specified", async () => {
        const gravatarAddress = "0x08d08e320e2b25184173331FcCCa122E4129523f";
        const latestBlockHash =
            "0x5d5cffb4a2e11140ba1d20bda13306103c705a4c70816860c1e6a93a7bce04ce";
        const latestBlockNumber = 7426646n;

        const SQL = await initSqlJs();
        const db = new SQL.Database();
        const gravatarDb = new GravatarDatabase(db);

        const client = testClient({
            blocks: [{ hash: latestBlockHash, number: latestBlockNumber }],
            logs: [
                {
                    address: gravatarAddress,
                    blockNumber: latestBlockNumber,
                    blockHash: latestBlockHash,
                    topics: [
                        encodeEventTopics({
                            abi: gravatarAbi,
                            eventName: "NewGravatar",
                        })[0],
                    ],
                    data: encodeAbiParameters(
                        parseAbiParameters(
                            "uint256 id,address owner,string displayName,string imageUrl",
                        ),
                        [
                            1n,
                            "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0335",
                            "George",
                            "https://no.where",
                        ],
                    ),
                },
            ],
        });

        const application = new Application(
            gravatarDb,
            client,
            gravatarAddress,
            zeroHash,
        );
        await application.updateDb();

        const result = await application.db.get(1n);
        expect(result.displayName).toEqual("George");
    });

    test("with 2 NewGravatar events in same block", async () => {
        const gravatarAddress = "0x08d08e320e2b25184173331FcCCa122E4129523f";
        const latestBlockHash =
            "0x5d5cffb4a2e11140ba1d20bda13306103c705a4c70816860c1e6a93a7bce04ce";

        const SQL = await initSqlJs();
        const db = new SQL.Database();
        const gravatarDb = new GravatarDatabase(db);

        const client = testClient({
            blocks: [{ hash: latestBlockHash }],
            logs: [
                {
                    address: gravatarAddress,
                    blockHash: latestBlockHash,
                    blockNumber: 7426646n,
                    topics: [
                        encodeEventTopics({
                            abi: gravatarAbi,
                            eventName: "NewGravatar",
                        })[0],
                    ],
                    data: encodeAbiParameters(
                        parseAbiParameters(
                            "uint256 id,address owner,string displayName,string imageUrl",
                        ),
                        [
                            1n,
                            "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0335",
                            "George",
                            "https://no.where",
                        ],
                    ),
                },
                {
                    address: gravatarAddress,
                    blockHash: latestBlockHash,
                    blockNumber: 7426646n,
                    topics: [
                        encodeEventTopics({
                            abi: gravatarAbi,
                            eventName: "NewGravatar",
                        })[0],
                    ],
                    data: encodeAbiParameters(
                        parseAbiParameters(
                            "uint256 id,address owner,string displayName,string imageUrl",
                        ),
                        [
                            2n,
                            "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0335",
                            "John",
                            "https://some.where",
                        ],
                    ),
                },
            ],
        });

        const application = new Application(
            gravatarDb,
            client,
            gravatarAddress,
            zeroHash,
        );
        await application.updateDb(latestBlockHash);

        const result1 = await application.db.get(1n);
        const result2 = await application.db.get(2n);
        expect(result1.displayName).toEqual("George");
        expect(result2.displayName).toEqual("John");
    });
});
