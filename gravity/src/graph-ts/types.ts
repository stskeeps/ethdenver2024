import { numberToHex } from "viem";

export type Address = `0x${string}`;

export class BigInt {
    constructor(public value: bigint) {
    }

    public toHex():`0x${string}` {
        return numberToHex(this.value);
    }
}
