"use client";

import { UnixFS } from "@helia/unixfs";
import { Buffer } from "buffer/";
import { CID } from "multiformats/cid";
import { useContext, useEffect, useState } from "react";

import { HeliaContext } from "../providers/HeliaProvider";

export const useHelia = () => {
    return useContext(HeliaContext);
};

export const useFile = (cid: CID, path?: string) => {
    const { fs } = useHelia();
    const [data, setData] = useState<Buffer | undefined>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const read = async (fs: UnixFS, cid: CID, path?: string) => {
            const chunks = [];
            console.log(`Loading CID ${cid}${path ?? ""}`);
            for await (const chunk of fs.cat(cid, { path })) {
                console.log(`chunk: ${chunk.length}`);
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            console.log(`Loaded ${buffer.length} bytes`);
            return buffer;
        };

        if (fs) {
            setLoading(true);
            read(fs, cid, path)
                .then(setData)
                .then(() => setLoading(false))
                .catch(setError);
        }
    }, [cid, fs, path]);

    return {
        data,
        error,
        loading,
    };
};
