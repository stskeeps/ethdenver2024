import Database from 'better-sqlite3';

const db = new Database('./index.db');
console.log('Connected to the index.db database.');


export function get(entity: string, id: string): any {
    console.log(`STORE GET: entity=${entity} id=${id}`)
    const result = db.prepare(`SELECT * FROM ${entity} WHERE id = ?`).get(id);
    return result;
}

export function set(entity: string, id: string, data: any): void {
    console.log(`STORE SET: entity=${entity} id=${id} data=${JSON.stringify(data)}`)

    db.prepare(`
        CREATE TABLE IF NOT EXISTS ${entity} (
            id TEXT PRIMARY KEY,
            data TEXT
        )
    `).run();

    const dataStr = JSON.stringify(data);
    db.prepare(`
        INSERT INTO ${entity} (id, data)
        VALUES ('${id}', '${dataStr}')
        ON CONFLICT(id)
        DO UPDATE SET data = '${dataStr}'
    `).run();
}
