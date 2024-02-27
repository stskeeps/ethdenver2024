import * as store from "../src/store"
import { expect, test } from 'vitest'

test('db', async () => {
    const db = await store.db();
    expect(db).not.toBeUndefined();
});
