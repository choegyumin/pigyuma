import debouncePromise from '@/src/debouncePromise';

const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

describe('debouncePromise', () => {
  test('should resolve all promises', async function () {
    let count = 0;
    const debounceTime = 100;
    const debounced = debouncePromise(() => ++count, debounceTime);

    const correctionTime = 4;
    const lessDelayTime = debounceTime - correctionTime;
    const moreDelayTime = debounceTime + correctionTime;

    const promises: Array<ReturnType<typeof debounced>> = [];

    promises.push(debounced());
    await wait(lessDelayTime);
    promises.push(debounced());
    await wait(lessDelayTime);
    promises.push(debounced());

    await expect(promises[0]).resolves.toBe(1);
    await expect(promises[1]).resolves.toBe(1);
    await expect(promises[2]).resolves.toBe(1);

    await wait(moreDelayTime);

    promises.push(debounced());
    await wait(moreDelayTime);
    promises.push(debounced());
    await wait(moreDelayTime);
    promises.push(debounced());

    await expect(promises[3]).resolves.toBe(2);
    await expect(promises[4]).resolves.toBe(3);
    await expect(promises[5]).resolves.toBe(4);
  });

  test('should reject promises except last one', async function () {
    const debounced = debouncePromise(() => 'value', 100, { reject: true });

    const promises: Array<ReturnType<typeof debounced>> = [];
    promises.push(debounced(), debounced(), debounced());

    await expect(promises[0]).rejects.toBe(undefined);
    await expect(promises[1]).rejects.toBe(undefined);
    await expect(promises[2]).resolves.toBe('value');
  });
});
