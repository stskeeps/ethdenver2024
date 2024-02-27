import { hexToNumber, numberToHex } from "viem"
import { db } from "./store"

export type Gravatar = {
  id: bigint,
  owner: `0x${string}`,
  displayName: string,
  imageUrl: string
}

export async function handleEvent(eventName: string, gravatar: Gravatar) {
  (await db()).run(`
    INSERT INTO Gravatar (id, owner, displayName, imageUrl)
    VALUES ('${numberToHex(gravatar.id)}', '${gravatar.owner}', '${gravatar.displayName}', '${gravatar.imageUrl}')
    ON CONFLICT(id)
    DO UPDATE SET owner = '${gravatar.owner}', displayName = '${gravatar.displayName}', imageUrl = '${gravatar.imageUrl}'
  `);
}

export async function get(id: bigint) : Promise<Gravatar> {
  const result = (await db()).prepare(`SELECT * FROM Gravatar where id='${numberToHex(id)}'`).getAsObject({}) as any;
  return result.id ? { ...result, id: hexToNumber(result.id) } : result;
}
