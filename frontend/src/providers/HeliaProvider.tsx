"use client";

import { unixfs, UnixFS } from "@helia/unixfs";
import { IDBBlockstore } from "blockstore-idb";
import { IDBDatastore } from "datastore-idb";
import { createHelia, Helia } from "helia";
import { createContext, ReactNode, useEffect, useState } from "react";

export type HeliaContextType = {
    helia: Helia | null;
    fs: UnixFS | null;
    error: boolean;
    starting: boolean;
};

export const HeliaContext = createContext<HeliaContextType>({
    helia: null,
    fs: null,
    error: false,
    starting: true,
});

export const HeliaProvider = ({ children }: { children: ReactNode }) => {
    const [helia, setHelia] = useState<Helia | null>(null);
    const [fs, setFs] = useState<UnixFS | null>(null);
    const [starting, setStarting] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const startHelia = async () => {
            const blockstore = new IDBBlockstore("helia-blocks");
            const datastore = new IDBDatastore("helia-data");

            await Promise.all([blockstore.open(), datastore.open()]);
            return createHelia({ blockstore, datastore });
        };

        console.info("starting helia");
        startHelia()
            .then((helia) => {
                setHelia(helia);
                setFs(unixfs(helia));
                setStarting(false);
            })
            .catch((error) => {
                console.error(error);
                setError(true);
                setStarting(false);
            });
    }, []);

    return (
        <HeliaContext.Provider
            value={{
                helia,
                fs,
                error,
                starting,
            }}
        >
            {children}
        </HeliaContext.Provider>
    );
};
