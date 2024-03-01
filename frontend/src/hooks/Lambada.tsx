import useSWR from "swr";

export type LambadaConfig = {
    host: string;
    chainCID: string;
};

type LambadaResponse = {
    error?: string;
    height?: number;
    state_cid?: string;
};

export const useStateCID = (lambadaConfig: LambadaConfig) => {
    // request latest from lambada node
    const { host, chainCID } = lambadaConfig;
    const url = `${host}/latest/${chainCID}`;
    const response = useSWR<LambadaResponse>(url, (url: string) =>
        fetch(url).then((res) => res.json())
    );
    const { data } = response;

    // error is request error
    let error = response.error;

    if (data?.error) {
        // use error from response body if there is one
        error = new Error(data.error);
    }

    let cid = undefined;
    if (data?.state_cid) {
        cid = data.state_cid;
    }

    return {
        ...response,
        error,
        cid,
    };
};
