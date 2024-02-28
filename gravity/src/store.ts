import initSqlJs, { Database, SqlJsStatic } from "sql.js";

export const START_BLOCK_HASH =
    process.env.START_BLOCK_HASH ||
    "0x59620400435e3555bd25fa51e60030ec82d9e1239cbe2beffba35dbe387be89e";

let _SQL: SqlJsStatic;
let _db: Database;

export async function db(): Promise<Database> {
    if (!_db) {
        _SQL = await initSqlJs();
        _db = new _SQL.Database();
        // TODO: place schema in a separate file
        _db.run(`
            CREATE TABLE IF NOT EXISTS Gravatar (
                id TEXT PRIMARY KEY,
                owner TEXT,
                displayName TEXT,
                imageUrl TEXT,
                blockHash TEXT,
                blockNumber TEXT
            );
            CREATE TABLE IF NOT EXISTS LatestBlock (
                blockHash TEXT
            );
            INSERT INTO LatestBlock (blockHash) VALUES ('${START_BLOCK_HASH}');
        `);
    }
    return _db;
}
