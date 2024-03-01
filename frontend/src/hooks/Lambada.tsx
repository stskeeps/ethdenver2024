import { CID } from "multiformats/cid";
import useSWR from "swr";

type LambadaResponse = {
    error?: string;
    height?: number;
    state_cid?: string;
};

export const useStateCID = (lambadaUrl: string) => {
    // request latest from lambada node
    const response = useSWR<LambadaResponse>(lambadaUrl);
    const { data } = response;

    // error is request error, or error that comes in the body of the response
    let error = response.error || data?.error;

    let cid = undefined;
    if (data?.state_cid) {
        try {
            // try to parse as CID...
            cid = CID.parse(data.state_cid);
        } catch (e) {
            // if fails set as error
            error = error || `Invalid CID: ${data.state_cid}`;
        }
    }

    return { ...response, error, cid };
};
