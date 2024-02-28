import { updateIndex } from "./dapp";

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

// TODO: change for local JSON-RPC endpoint
export const RPC_URL = process.env.RPC_URL;

const main = async () => {
  // TODO: get block hash from get_tx input
  let status = await updateIndex("0x5d5cffb4a2e11140ba1d20bda13306103c705a4c70816860c1e6a93a7bce04ce");
  // let status = await handleInput("0x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5");
  console.log(`Result status: ${status}`)
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
