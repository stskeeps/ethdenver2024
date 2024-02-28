import { updateIndex } from "./dapp";

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const main = async () => {
    // TODO: get block hash from get_tx input
    let status = await updateIndex(
        "0x0a08af7a28c068dbd4fbecf3a7fa0eeefc2b2f5d671d780f2bb5c1cdc0d8e182",
    );
    // let status = await handleInput("0x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5");
    console.log(`Result status: ${status}`);
};

main().catch((e) => {
    console.log(e);
    process.exit(1);
});
