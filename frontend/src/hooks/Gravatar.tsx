"use client";
import useSWR from "swr";

import { useFile } from "./Helia";
import { LambadaConfig, useStateCID } from "./Lambada";
import { useDatabase, useQuery } from "./SQLite";
import { Gravatar } from "../types";

export const useGravatars = (config: LambadaConfig) => {
    const {
        cid,
        error: lambadaError,
        isLoading: lambadaLoading,
    } = useStateCID(config);
    const path = "/gravatar.sqlite3";

    // fetch db from IPFS
    const {
        data: ipfsFile,
        error: ipfsError,
        loading: ipfsLoading,
    } = useFile(cid, path);

    // fetch db file
    /*
    const { data: urlFile } = useSWR("/gravatar.sqlite3", (url) =>
        fetch(url)
            .then((res) => res.arrayBuffer())
            .then(Buffer.from)
    );
    */

    // load SQLite db
    const { db, error: dbError, loading: dbLoading } = useDatabase(ipfsFile);

    // query DB
    const { result } = useQuery(
        db,
        "SELECT id, owner, displayName, imageUrl FROM Gravatar"
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
        error: lambadaError || ipfsError || dbError,
        loading: lambadaLoading || ipfsLoading || dbLoading,
    };
};
