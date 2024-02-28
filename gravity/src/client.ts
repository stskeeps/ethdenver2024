import { createPublicClient, http } from "viem";

const rpcUrl = process.env.RPC_URL;

// create RPC client
export const client = createPublicClient({ transport: http(rpcUrl) });
