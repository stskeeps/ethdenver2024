import { create } from "kubo-rpc-client";
import path from "path";
import initSqlJs, { Database } from "sql.js";

const loadFile = async (filename: string): Promise<Buffer> => {
    const client = create();
    try {
        // check if file exists (exception if not exists)
        await client.files.stat(filename);

        // read file to buffer
        const chunks = [];
        for await (const chunk of client.files.read(filename)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    } catch (error) {
        // file does not exist, just return empty buffer, will create an empty database
        return Buffer.alloc(0);
    }
};

export async function loadDb(filename: string): Promise<Database> {
    // load database file from IPFS
    const file = await loadFile(filename);

    // initialize SQLite engine
    const SQL = await initSqlJs();

    // initialize db from file
    return new SQL.Database(file);
}

export async function storeDb(db: Database, filename: string): Promise<void> {
    // create IPFS client
    const client = create();

    // extract directory name
    const dirname = path.dirname(filename);

    // create intermediate directories if they don't exist
    client.files.mkdir(dirname, { parents: true });

    // store to IPFS
    await client.files.write(filename, db.export(), { create: true });
}
