"use client";

import { useEffect, useState } from "react";
import initSqlJs, { Database, QueryExecResult } from "sql.js";

export const useDatabase = (
    data: ArrayLike<number> | Buffer | null | undefined
) => {
    const [db, setDb] = useState<Database | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (data) {
            initSqlJs({
                // Fetch sql.js wasm file from CDN
                // This way, we don't need to deal with webpack
                locateFile: (file) => `https://sql.js.org/dist/${file}`,
            })
                .then((SQL) => {
                    console.log(
                        `Loading SQLite3 database from buffer(${data.length})`
                    );
                    setDb(new SQL.Database(data));
                    setLoading(false);
                })
                .catch((error) => {
                    setError(
                        error instanceof Error
                            ? error
                            : new Error(String(error))
                    );
                    setLoading(false);
                });
        }
    }, [data]);

    return { db, error, loading };
};

export const useQuery = (db: Database | null, sql: string) => {
    const [result, setResult] = useState<QueryExecResult[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (db) {
            setLoading(true);
            try {
                const result = db.exec(sql);
                setResult(result);
            } catch (error: unknown) {
                setError(
                    error instanceof Error ? error : new Error(String(error))
                );
                setLoading(false);
            }
        }
    }, [db]);
    return {
        loading,
        result,
    };
};
