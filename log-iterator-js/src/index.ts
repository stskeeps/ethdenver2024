import { BlockHeader } from "@ethereumjs/block";
import { Chain, Common, Hardfork } from "@ethereumjs/common";
import { NestedUint8Array, RLP } from "@ethereumjs/rlp";
import { Trie, TrieNode } from "@ethereumjs/trie";
import { Log } from "@ethereumjs/evm";
import { EIP4844BlobTxReceipt, TxReceipt } from "@ethereumjs/vm";
import { MapDB } from "@ethereumjs/util";
import { Hex, bytesToHex } from "viem";

// optimism server
const opUrl = "http://web3.link:8000";
const common = new Common({ chain: Chain.Sepolia, hardfork: Hardfork.Cancun });

/*
type rlpLog = Log;
type rlpReceipt = [
    postStateOrStatus: Uint8Array,
    cumulativeGasUsed: Uint8Array,
    logs: rlpLog[]
];
*/

/**
 * DB implementation that fetches from Optimism Preimage on get
 */
class OptimismDB<TKey extends string | number | Uint8Array> extends MapDB<
    TKey,
    Uint8Array
> {
    async get(key: TKey): Promise<Uint8Array | undefined> {
        if (key) {
            // console.log(`fetching key ${key}`);
            const response = await fetch(`${opUrl}/dehash/${key}`);
            if (response.ok) {
                const buffer = await response.arrayBuffer();
                const buf = new Uint8Array(buffer);
                return buf;
            }
        }
        return undefined;
    }
}

const getBlockHeader = async (hash: Hex): Promise<BlockHeader | undefined> => {
    // hint for block header
    const response = await fetch(`${opUrl}/hint/l1-block-header%20${hash}`);
    if (response.ok) {
        const headerResponse = await fetch(
            `${opUrl}/dehash/${hash.substring(2)}`
        );
        const buf = await headerResponse.arrayBuffer();
        const block = BlockHeader.fromRLPSerializedHeader(new Uint8Array(buf), {
            common,
        });
        return block;
    }
    return undefined;
};

const getBlockReceipts = async (
    hash: Hex,
    header: BlockHeader
): Promise<EIP4844BlobTxReceipt[] | undefined> => {
    const url = `${opUrl}/hint/l1-receipts%20${hash.substring(2)}`;
    const response = await fetch(url);
    if (response.ok) {
        // create a Trie that uses a DB that fetches data from Optimis Preimage on get
        const receiptTrie = await Trie.create({
            root: header.receiptTrie,
            db: new OptimismDB(),
        });

        // walk over all value nodes
        await receiptTrie.walkAllValueNodes(
            async (node: TrieNode, key: number[]) => {
                console.log(key, node);
            }
        );
    }
    return undefined;
};

const main = async () => {
    const blockHash =
        "0x6e4dd5b03a4fa7b85be4d6bd78bf641cf2fd1de92c8eb9b673c14edd349258d5";
    const block = await getBlockHeader(blockHash);
    const receipts = getBlockReceipts(blockHash, block!);
    return;
};

main().catch((error) => {
    console.log(error);
    process.exit(1);
});
