import { Database } from "sql.js";
import { Address, Hash, hexToBigInt, numberToHex } from "viem";

import { schema } from "./schema.js";

export type Gravatar = {
    id: bigint;
    owner: Address;
    displayName: string;
    imageUrl: string;
    blockHash: Hash;
    blockNumber: bigint;
};

export class GravatarDatabase {
    private db: Database;

    constructor(db: Database, startBlock: Hash) {
        this.db = db;

        // create table if not exists
        db.run(schema(startBlock));
    }

    async upsert(gravatar: Gravatar) {
        // TODO: differentiate NewGravatar and UpdatedGravatar events
        this.db.run(`
        INSERT INTO Gravatar (id, owner, displayName, imageUrl, blockHash, blockNumber)
        VALUES (
            '${numberToHex(gravatar.id)}',
            '${gravatar.owner}',
            '${gravatar.displayName}',
            '${gravatar.imageUrl}',
            '${gravatar.blockHash}',
            '${numberToHex(gravatar.blockNumber)}'
        )
        ON CONFLICT(id)
        DO UPDATE SET
            owner = '${gravatar.owner}',
            displayName = '${gravatar.displayName}',
            imageUrl = '${gravatar.imageUrl}',
            blockHash = '${gravatar.blockHash}',
            blockNumber = '${numberToHex(gravatar.blockNumber)}'
    `);
    }

    async get(id: bigint): Promise<Gravatar> {
        const result = this.db
            .prepare(`SELECT * FROM Gravatar where id='${numberToHex(id)}'`)
            .getAsObject({}) as any;
        return result.id
            ? {
                  ...result,
                  id: hexToBigInt(result.id),
                  blockNumber: hexToBigInt(result.blockNumber),
              }
            : result;
    }

    async getLatestBlockHash() {
        const result = this.db
            .prepare(`SELECT blockHash FROM LatestBlock`)
            .getAsObject({});
        return result.blockHash as Hash;
    }

    async updateLatestBlockHash(blockHash: Hash) {
        this.db.run(`UPDATE LatestBlock SET blockHash = '${blockHash}'`);
    }

    async count(): Promise<number> {
        const count = this.db
            .prepare("SELECT COUNT(*) as c FROM Gravatar")
            .getAsObject({})
            ["c"]?.valueOf();
        return count as number;
    }
}
