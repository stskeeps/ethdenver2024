import * as store from "../../src/graph-ts/store"
import { describe, expect, test } from 'vitest'

describe("store", () => {

    test('set+get', async () => {
        const id = "myid";
        const data =  { attr: "value"};
        await store.set("entity", id, data);
        const result = await store.get("entity", id);
        expect(result.id).toEqual(id);
        expect(result.data).toEqual(JSON.stringify(data));
    })

});
