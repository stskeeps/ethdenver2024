// database schema
export const schema = () => `CREATE TABLE IF NOT EXISTS Gravatar (
        id TEXT PRIMARY KEY,
        owner TEXT,
        displayName TEXT,
        imageUrl TEXT,
        blockHash TEXT,
        blockNumber TEXT
    );
    CREATE TABLE IF NOT EXISTS LatestBlock (blockHash TEXT);
    INSERT INTO LatestBlock (blockHash) VALUES ('');
`;
