"use client";
import { CID } from "multiformats/cid";
import useSWR from "swr";

import { useFile } from "./Helia";
import { Gravatar } from "../types";
import { useDatabase, useQuery } from "./SQLite";

export const useGravatars = (cid: CID, path?: string) => {
    // fetch db from IPFS (XXX: not working yet)
    const {
        data: ipfsFile,
        error: ipfsError,
        loading: ipfsLoading,
    } = useFile(cid, path);

    // fetch db file (XXX: replace by IPFS cat)
    const { data: urlFile } = useSWR("/gravatar.sqlite3", (url) =>
        fetch(url)
            .then((res) => res.arrayBuffer())
            .then(Buffer.from)
    );

    // load SQLite db
    const { db, error: dbError, loading: dbLoading } = useDatabase(ipfsFile);

    // query DB
    const { result } = useQuery(
        db,
        "SELECT id, owner, displayName, imageUrl FROM gravatars"
    );

    const data: Gravatar[] =
        result.length > 0
            ? result[0].values.map((row) => ({
                  id: row[0]!.toString(),
                  owner: row[1]!.toString(),
                  displayName: row[2]!.toString(),
                  imageUrl: row[3]!.toString(),
              }))
            : [];

    return {
        data,
        error: ipfsError || dbError,
        loading: ipfsLoading || dbLoading,
    };
};
