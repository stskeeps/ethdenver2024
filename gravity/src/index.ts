import createClient from "openapi-fetch";
import { handleNewGravatar, handleUpdatedGravatar } from "./mapping";
import { BigInt} from "../generated/graph-ts/types";

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const dehashEvents: any = async (data: any) => {
  // TODO
  return [
    {
      name: "NewGravatar",
      params: {
        id: new BigInt(10n),
        owner: "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0335",
        displayName: "George",
        imageUrl: "https://no.where"
      }
    },
    {
      name: "UpdateGravatar",
      params: {
        id: new BigInt(10n),
        owner: "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0335",
        displayName: "George Clown",
        imageUrl: "https://some.where.else"
      }
    }
  ]
}

const handleInput = async (data: any) => {
  console.log("Received input " + JSON.stringify(data));
  // TODO
  // - dehash block and get events
  const events = await dehashEvents(data);
  if (events && events.length) {
    for (const event of events) {
      console.log(`event: ${event.name}`)
      if (event.name === "NewGravatar") {
        handleNewGravatar(event);
      } else if (event.name === "UpdateGravatar") {
        handleUpdatedGravatar(event);
      }
    }
  }
  return "accept";
};

const main = async () => {
  // TODO: get input
  let status = await handleInput("0x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5");
  console.log(`Result status: ${status}`)
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
