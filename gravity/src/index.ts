import { InvalidArgumentError, program } from "@commander-js/extra-typings";
import { create } from "kubo-rpc-client";
import {
    Address,
    Hash,
    createPublicClient,
    getAddress,
    http,
    isAddress,
    isHash,
} from "viem";

import { Application } from "./application.js";
import { GravatarDatabase } from "./db.js";
import { loadDb, storeDb } from "./store.js";

// option parse as Address
const addressParse = (value: string, _previous: Address): Address => {
    if (isAddress(value)) {
        return value;
    }
    throw new InvalidArgumentError("Invalid address");
};

// option parse as Hash
const hashParse = (value: string, _previous: Hash): Hash => {
    if (isHash(value)) {
        return value;
    }
    throw new InvalidArgumentError("Invalid hash");
};

program
    .name("gravatar")
    .argument("[blockHash]", "Current block hash", hashParse)
    .option(
        "-r, --rpc-url <url>",
        "Ethereum RPC URL",
        process.env.RPC_URL ?? "http://127.0.0.1:8545",
    )
    .option(
        "--gravatar-address <address>",
        "Gravatar contract address",
        addressParse,
        process.env.GRAVATAR_ADDRESS && isAddress(process.env.GRAVATAR_ADDRESS)
            ? getAddress(process.env.GRAVATAR_ADDRESS)
            : "0x08d08e320e2b25184173331FcCCa122E4129523f", // GravatarRegistry on sepolia
    )
    .option(
        "--rollups-address [address]",
        "Rollups server address",
        process.env.ROLLUP_HTTP_SERVER_URL,
    )
    .option(
        "--genesis-block <hash>",
        "Genesis block hash",
        hashParse,
        process.env.GENESIS_BLOCK_HASH && isHash(process.env.GENESIS_BLOCK_HASH)
            ? process.env.GENESIS_BLOCK_HASH
            : "0xe3569d46c9698490cc7d24fffb056f1d81e60930ef33addbf96547a1ba9cb483", // block of deployment of GravatarRegistry on sepolia
    )
    .option("--ipfs-url <value>", "IPFS node URL")
    .option(
        "--db-filename <filename>",
        "Database filename",
        "/state/gravatar.sqlite3",
    )
    .action(async (blockHash, options) => {
        const {
            dbFilename,
            genesisBlock,
            gravatarAddress,
            ipfsUrl,
            rpcUrl,
            rollupsAddress,
        } = options;

        // create Ethereum client
        console.log(`connecting to provider at ${rpcUrl}`);
        const client = createPublicClient({ transport: http(rpcUrl) });

        // create IPFS client
        const ipfsClient = create({ url: ipfsUrl });

        // get tx
        if (rollupsAddress) {
            await fetch(`${rollupsAddress}/get_tx`);
        }

        // load db from IPFS
        const db = await loadDb(ipfsClient, dbFilename);

        // create gravatar db
        const gravatarDb = new GravatarDatabase(db);

        // update index
        const app = new Application(
            gravatarDb,
            client,
            gravatarAddress,
            genesisBlock,
        );
        await app.updateDb(blockHash);

        // store db back to IPFS
        await storeDb(ipfsClient, db, dbFilename);
    });

program.parse(process.argv);
