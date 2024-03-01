import { Address, Hash, PublicClient, parseEventLogs } from "viem";

import { GravatarDatabase } from "./db.js";
import gravatarAbi from "./gravatarAbi.js";

export class Application {
    private client: PublicClient;
    public readonly db: GravatarDatabase;
    private gravatarRegistry: Address;
    private genesisBlockHash: Hash;

    constructor(
        db: GravatarDatabase,
        client: PublicClient,
        gravatarRegistry: Address,
        genesisBlockHash: Hash,
    ) {
        this.client = client;
        this.db = db;
        this.gravatarRegistry = gravatarRegistry;
        this.genesisBlockHash = genesisBlockHash;
    }

    private async fetchBlockRange(from: Hash, to: Hash) {
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
    }

    private async getLatestBlockHash(): Promise<Hash> {
        // get latest block number
        const blockNumber = await this.client.getBlockNumber();

        // get latest block (using the number)
        const { hash } = await this.client.getBlock({ blockNumber });
        console.log(`latest block hash in chain is ${hash}`);

        return hash;
    }

    private async fetchLogs(address: Address, blockHash: Hash) {
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
    }

    public async updateDb(blockHash?: Hash) {
        if (blockHash) {
            console.log(`updating database based on block hash ${blockHash}`);
        }

        // get block the database "is at"
        const dbBlockHash = await this.db.getLatestBlockHash(
            this.genesisBlockHash,
        );
        console.log(`latest block hash in database is ${dbBlockHash}`);

        // get chain latest blockHash (or use provided blockHash)
        const latestBlockHash = blockHash || (await this.getLatestBlockHash());

        // fetch all blocks from latest to where we are up to date
        console.log(
            `fetching blocks from ${latestBlockHash} back to ${dbBlockHash}`,
        );
        const blocks = await this.fetchBlockRange(latestBlockHash, dbBlockHash);

        for (const block of blocks) {
            console.log(`fetching logs of block ${block.hash}`);
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
        await this.db.updateLatestBlockHash(latestBlockHash);
    }
}
