import { Address, Hex, createPublicClient, http } from "viem";

import { Application } from "./application";
import { loadDb, storeDb } from "./store";
import { GravatarDatabase } from "./db";

const rpcUrl = process.env.RPC_URL;
const gravatarAddress: Address =
    (process.env.GRAVATAR_ADDRESS as Address) ||
    "0x08d08e320e2b25184173331FcCCa122E4129523f";

const startBlockHash =
    (process.env.START_BLOCK_HASH as Hex) ||
    "0xe3569d46c9698490cc7d24fffb056f1d81e60930ef33addbf96547a1ba9cb483"; // block of deployment of GravatarRegistry on sepolia

const main = async () => {
    const client = createPublicClient({ transport: http(rpcUrl) });

    // load db from IPFS
    const dbFilename = "/state/gravatar.sqlite3";
    const db = await loadDb(dbFilename);

    // create gravatar db
    const gravatarDb = new GravatarDatabase(db, startBlockHash);

    // TODO: get block hash from get_tx input metadata
    const currentBlockHash =
        "0x5fd72d79165dc9940882a1b9bb415bed4af94a349fbfdbcc5aea9abd1a06c49b"; // block 5384042 on sepolia

    // update index
    const app = new Application(gravatarDb, client, gravatarAddress);
    await app.updateDb(currentBlockHash);

    // store db back to IPFS
    await storeDb(db, dbFilename);
};

main().catch((e) => {
    console.log(e);
    process.exit(1);
});
