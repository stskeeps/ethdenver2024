import { Hex } from "viem";

import { client } from "./client";
import { Application } from "./application";
import { loadDb, storeDb } from "./store";
import { GravatarDatabase } from "./db";

const startBlockHash =
    (process.env.START_BLOCK_HASH as Hex) ||
    "0x59620400435e3555bd25fa51e60030ec82d9e1239cbe2beffba35dbe387be89e";

const main = async () => {
    // load db from IPFS
    const dbFilename = "/state/gravatar.sqlite3";
    const db = await loadDb(dbFilename);

    // create gravatar db
    const gravatarDb = new GravatarDatabase(db, startBlockHash);

    // TODO: get block hash from get_tx input metadata
    const currentBlockHash =
        "0x0a08af7a28c068dbd4fbecf3a7fa0eeefc2b2f5d671d780f2bb5c1cdc0d8e182";

    // update index
    const app = new Application(gravatarDb, client);
    await app.updateDb(currentBlockHash);

    // store db back to IPFS
    await storeDb(db, dbFilename);
};

main().catch((e) => {
    console.log(e);
    process.exit(1);
});
