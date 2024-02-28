import * as gravatar from "./gravatar";

export const updateIndex = async (blockHash: `0x${string}`) => {
  console.log("Updating index based on block hash " + JSON.stringify(blockHash));
  // TODO
  // - parse block, traverse backwards collecting block hashes until initial block, and then collect logs
  const logs = await gravatar.fetchLogs(blockHash);
  logs?.forEach(async (log) => {
    await gravatar.handleEvent(log.eventName, log.args);
  });
  return "accept";
};
