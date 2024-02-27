import * as gravatar from "../src/gravatar"
import { expect, test } from 'vitest'

test('list empty', async () => {
    const result = await gravatar.get("0x1");
    expect(result).toEqual({});
});

test('add 2 events', async () => {
    await gravatar.handleEvent({
        name: "NewGravatar",
        params: {
          id: "0x1",
          owner: "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0335",
          displayName: "George",
          imageUrl: "https://no.where"
        }
      });
      await gravatar.handleEvent({
        name: "NewGravatar",
        params: {
          id: "0x2",
          owner: "0xF05D57a5BeD2d1B529C56001FC5810cc9afC0336",
          displayName: "John",
          imageUrl: "https://some.where"
        }
      });
    const result1 = await gravatar.get("0x1");
    const result2 = await gravatar.get("0x2");
    expect(result1.displayName).toEqual("George");
    expect(result2.displayName).toEqual("John");
});
