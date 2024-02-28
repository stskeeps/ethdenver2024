import { createPublicClient, http } from "viem";

export const RPC_URL = process.env.RPC_URL;

export const client = createPublicClient({ transport: http(RPC_URL) });
