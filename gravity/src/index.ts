import { Log, createPublicClient, decodeEventLog, getAddress, http } from "viem";
import gravatarAbi from "./gravatarAbi";
import * as gravatar from "./gravatar";

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

// TODO: change for local JSON-RPC endpoint
const RPC_URL = "https://mainnet.infura.io/v3/feac159f5dd64ec9b9b9ac3d1a493144";

const GRAVATAR_ADDRESS = "0x2E645469f354BB4F5c8a05B3b30A929361cf77eC";

const fetchGravatarLogs = async (blockHash: `0x${string}`) => {
  const client = createPublicClient({ transport: http(RPC_URL) })
  const logs = await client.getLogs({blockHash: blockHash})
  const gravatarLogs = logs.filter(log => getAddress(log.address) === GRAVATAR_ADDRESS);
  const decodedLogs = gravatarLogs.map(log => {
    return decodeEventLog({
      abi: gravatarAbi,
      data: log.data,
      topics: log.topics
    })
  })
  return decodedLogs;
}


const handleInput = async (data: any) => {
  console.log("Received input " + JSON.stringify(data));
  // TODO
  // - parse block, traverse backwards collecting block hashes until initial block, and then collect logs
  const logs = await fetchGravatarLogs(data);
  logs?.forEach(async (log) => {
    console.log(`log: ${Object.entries(log.args)}`)
    await gravatar.handleEvent(log.eventName, log.args);
  });
  return "accept";
};

const main = async () => {
  // TODO: get input
  let status = await handleInput("0x5d5cffb4a2e11140ba1d20bda13306103c705a4c70816860c1e6a93a7bce04ce");
  // let status = await handleInput("0x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5");
  console.log(`Result status: ${status}`)
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
