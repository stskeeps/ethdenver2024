import { db } from "./store"

type Gravatar = {
  id: `0x${string}`,
  owner: `0x${string}`,
  displayName: string,
  imageUrl: string
}

export async function handleEvent(event: any) {
  const p = event.params;
  (await db()).run(`
    INSERT INTO Gravatar (id, owner, displayName, imageUrl)
    VALUES ('${p.id}', '${p.owner}', '${p.displayName}', '${p.imageUrl}')
    ON CONFLICT(id)
    DO UPDATE SET owner = '${p.owner}', displayName = '${p.displayName}', imageUrl = '${p.imageUrl}'
  `);
}

export async function get(id: string) : Promise<Gravatar> {
  return (await db()).prepare(`SELECT * FROM Gravatar where id='${id}'`).getAsObject({}) as Gravatar;
}
