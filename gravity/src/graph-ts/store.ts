import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

let _SQL: SqlJsStatic;
let _db: Database;

async function db(): Promise<Database> {
    if (!_db) {
        _SQL = await initSqlJs();
        _db = new _SQL.Database();
    }
    return _db;
}

export async function get(entity: string, id: string): Promise<any> {
    console.log(`STORE GET: entity=${entity} id=${id}`)
    const result = (await db()).prepare(`SELECT * FROM ${entity} WHERE id='${id}'`).getAsObject({});
    console.log(JSON.stringify(result))
    return result;
}

export async function set(entity: string, id: string, data: any) {
    
    console.log(`STORE SET: entity=${entity} id=${id} data=${JSON.stringify(data)}`);

    (await db()).run(`
        CREATE TABLE IF NOT EXISTS ${entity} (
            id TEXT PRIMARY KEY,
            data TEXT
        )
    `);

    const dataStr = JSON.stringify(data);
    (await db()).run(`
        INSERT INTO ${entity} (id, data)
        VALUES ('${id}', '${dataStr}')
        ON CONFLICT(id)
        DO UPDATE SET data = '${dataStr}'
    `);
}
