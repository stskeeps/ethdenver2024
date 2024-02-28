"use client";

import { useState } from "react";
import { Gravatar } from "../types";
import useSWR from "swr";
import { useDatabase, useQuery } from "./SQLite";
import { useFile } from "./Helia";

export const useGravatars = (cid: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // fetch db from IPFS (XXX: not working yet)
    const { data: ipfsFile, error: ipfsError } = useFile(cid);

    // fetch db file (XXX: replace by IPFS cat)
    const { data: urlFile } = useSWR("/gravatar.sqlite3", (url) =>
        fetch(url)
            .then((res) => res.arrayBuffer())
            .then(Buffer.from)
    );

    // load SQLite db
    const { db } = useDatabase(ipfsFile);

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
        error: error || ipfsError,
        loading,
    };
};
