import initSqlJs, { Database, SqlJsStatic } from "sql.js";

let _SQL: SqlJsStatic;
let _db: Database;

export async function db(): Promise<Database> {
    if (!_db) {
        _SQL = await initSqlJs();
        _db = new _SQL.Database();
        _db.run(`
            CREATE TABLE IF NOT EXISTS Gravatar (
                id TEXT PRIMARY KEY,
                owner TEXT,
                displayName TEXT,
                imageUrl TEXT
            )
        `);
    }
    return _db;
}
