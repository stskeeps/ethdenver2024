"use client";

import { UnixFS } from "@helia/unixfs";
import { Buffer } from "buffer/";
import { CID } from "multiformats/cid";
import { useContext, useEffect, useState } from "react";

import { HeliaContext } from "../providers/HeliaProvider";

export const useHelia = () => {
    return useContext(HeliaContext);
};

export const useFile = (cid?: string, path?: string) => {
    const { fs, starting } = useHelia();
    const [data, setData] = useState<Buffer | undefined>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const read = async (fs: UnixFS, cid: CID, path?: string) => {
            const chunks = [];
            console.log(`Loading CID ${cid}${path ?? ""}`);
            try {
                for await (const chunk of fs.cat(cid, { path })) {
                    console.log(`chunk: ${chunk.length}`);
                    chunks.push(chunk);
                }
                const buffer = Buffer.concat(chunks);
                console.log(`Loaded ${buffer.length} bytes`);
                return buffer;
            } catch (error) {
                throw new Error(
                    `Failed to load CID ${cid}${path ?? ""}: ${error}`
                );
            }
        };

        if (cid && fs) {
            setLoading(true);
            read(fs, CID.parse(cid), path)
                .then(setData)
                .then(() => setLoading(false))
                .catch((error) => {
                    setError(error);
                    setLoading(false);
                });
        }
    }, [cid, fs, path]);

    return {
        data,
        error,
        loading: starting || loading,
    };
};
