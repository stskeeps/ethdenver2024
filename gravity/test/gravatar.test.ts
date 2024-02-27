import * as gravatar from "../src/gravatar"
import { expect, test } from 'vitest'

test('list empty', async () => {
    const result = await gravatar.get(1n);
    expect(result).toEqual({});
});

test('add 2 events', async () => {
    await gravatar.handleEvent("NewGravatar", {
        id: 1n,
        owner: "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0335",
        displayName: "George",
        imageUrl: "https://no.where"
    });
    await gravatar.handleEvent("NewGravatar", {
      id: 2n,
      owner: "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0336",
      displayName: "John",
      imageUrl: "https://some.where"
    });
    const result1 = await gravatar.get(1n);
    const result2 = await gravatar.get(2n);
    expect(result1.displayName).toEqual("George");
    expect(result2.displayName).toEqual("John");
});
