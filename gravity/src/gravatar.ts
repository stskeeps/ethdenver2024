import {
    Address,
    Hex,
    createPublicClient,
    decodeEventLog,
    getAddress,
    hexToNumber,
    http,
    numberToHex,
} from "viem";
import { db } from "./store";
import { RPC_URL } from ".";
import gravatarAbi from "./gravatarAbi";

const GRAVATAR_ADDRESS =
    process.env.GRAVATAR_ADDRESS ||
    "0x2E645469f354BB4F5c8a05B3b30A929361cf77eC";

export type Gravatar = {
    id: bigint;
    owner: Address;
    displayName: string;
    imageUrl: string;
};

export async function handleEvent(eventName: string, gravatar: Gravatar) {
    console.log(`Handling ${eventName} event with id '${gravatar.id}'`);
    // TODO: differentiate NewGravatar and UpdatedGravatar events
    // TODO: store latest block hash
    (await db()).run(`
    INSERT INTO Gravatar (id, owner, displayName, imageUrl)
    VALUES ('${numberToHex(gravatar.id)}', '${gravatar.owner}', '${
        gravatar.displayName
    }', '${gravatar.imageUrl}')
    ON CONFLICT(id)
    DO UPDATE SET owner = '${gravatar.owner}', displayName = '${
        gravatar.displayName
    }', imageUrl = '${gravatar.imageUrl}'
  `);
}

export async function get(id: bigint): Promise<Gravatar> {
    const result = (await db())
        .prepare(`SELECT * FROM Gravatar where id='${numberToHex(id)}'`)
        .getAsObject({}) as any;
    return result.id ? { ...result, id: hexToNumber(result.id) } : result;
}

export const fetchLogs = async (blockHash: Hex) => {
    const client = createPublicClient({ transport: http(RPC_URL) });
    const logs = await client.getLogs({ blockHash: blockHash });
    const gravatarLogs = logs?.filter(
        (log) => getAddress(log.address) === GRAVATAR_ADDRESS,
    );
    const decodedLogs = gravatarLogs?.map((log) => {
        return decodeEventLog({
            abi: gravatarAbi,
            data: log.data,
            topics: log.topics,
        });
    });
    return decodedLogs;
};
