import {
    Address,
    Hex,
    decodeEventLog,
    getAddress,
    hexToNumber,
    numberToHex,
} from "viem";
import { db } from "./store";
import gravatarAbi from "./gravatarAbi";
import { client } from "./client";
import { updateLatestBlockHash } from "./blocks";

const GRAVATAR_ADDRESS =
    process.env.GRAVATAR_ADDRESS ||
    "0x2E645469f354BB4F5c8a05B3b30A929361cf77eC";

export type Gravatar = {
    id: bigint;
    owner: Address;
    displayName: string;
    imageUrl: string;
    blockHash: Hex;
    blockNumber: bigint;
};

export async function handleEvent(eventName: string, gravatar: Gravatar) {
    console.log(
        `Handling ${eventName} event with id '${gravatar.id}' at block '${gravatar.blockHash}`,
    );

    // TODO: differentiate NewGravatar and UpdatedGravatar events
    (await db()).run(`
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

export async function get(id: bigint): Promise<Gravatar> {
    const result = (await db())
        .prepare(`SELECT * FROM Gravatar where id='${numberToHex(id)}'`)
        .getAsObject({}) as any;
    return result.id
        ? {
              ...result,
              id: hexToNumber(result.id),
              blockNumber: hexToNumber(result.blockNumber),
          }
        : result;
}

export const fetchLogs = async (blockHash: Hex) => {
    const logs = await client.getLogs({ blockHash: blockHash });
    const gravatarLogs = logs?.filter(
        (log) => getAddress(log.address) === GRAVATAR_ADDRESS,
    );
    const decodedLogs = gravatarLogs?.map((log) => {
        const decoded = decodeEventLog({
            abi: gravatarAbi,
            data: log.data,
            topics: log.topics,
        });
        return {
            eventName: decoded.eventName,
            args: {
                ...decoded.args,
                blockNumber: log.blockNumber,
                blockHash: log.blockHash,
            },
        };
    });
    return decodedLogs;
};
