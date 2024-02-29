import { Address, Hex, PublicClient, parseEventLogs } from "viem";

import { GravatarDatabase } from "./db";
import gravatarAbi from "./gravatarAbi";

export class Application {
    private client: PublicClient;
    public readonly db: GravatarDatabase;
    private gravatarRegistry: Address;

    constructor(
        db: GravatarDatabase,
        client: PublicClient,
        gravatarRegistry: Address,
    ) {
        this.client = client;
        this.db = db;
        this.gravatarRegistry = gravatarRegistry;
    }

    private fetchBlockRange = async (from: Hex, to: Hex) => {
        // fetch blocks from RPC provider one by one, in reverse order using parentHash
        const blocks = [];
        let blockHash = from;
        while (blockHash && blockHash !== to) {
            console.log(`fetching block ${blockHash}`);
            const block = await this.client.getBlock({ blockHash });
            if (!block) {
                break;
            }
            blocks.push(block);
            blockHash = block.parentHash;
        }

        // reverse block list so we can traverse in the forward order
        return blocks.reverse();
    };

    private fetchLogs = async (address: Address, blockHash: Hex) => {
        // get logs from provider
        const logs = await this.client.getLogs({ address, blockHash });

        const newGravatarLogs = parseEventLogs({
            abi: gravatarAbi,
            eventName: "NewGravatar",
            logs: logs,
            strict: true,
        });

        const updateGravatarLogs = parseEventLogs({
            abi: gravatarAbi,
            eventName: "UpdatedGravatar",
            logs: logs,
            strict: true,
        });

        return { newGravatarLogs, updateGravatarLogs };
    };

    public async updateDb(blockHash: Hex) {
        console.log(`updating database based on block hash ${blockHash}`);

        // get block the database "is at"
        const latestBlockHash = await this.db.getLatestBlockHash();
        console.log(`latest block hash in database is ${latestBlockHash}`);

        // fetch all blocks from latest to where we are up to date
        console.log(`fetching blocks from ${blockHash} to ${latestBlockHash}`);
        const blocks = await this.fetchBlockRange(blockHash, latestBlockHash);

        for (const block of blocks) {
            console.log(`fetching logs from block ${block.hash}`);
            const { newGravatarLogs, updateGravatarLogs } =
                await this.fetchLogs(this.gravatarRegistry, block.hash);

            for (const log of newGravatarLogs) {
                const entity = { ...log, ...log.args };
                console.log(
                    `creating gravatar ${entity.id.toString()} from block ${entity.blockNumber}`,
                );
                this.db.upsert(entity);
            }

            for (const log of updateGravatarLogs) {
                const entity = { ...log, ...log.args };
                console.log(
                    `updating gravatar ${entity.id.toString()} from block ${entity.blockNumber}`,
                );
                this.db.upsert(entity);
            }
        }

        // update latest processed block
        console.log(`updating latest block hash to ${blockHash}`);
        await this.db.updateLatestBlockHash(blockHash);
    }
}
