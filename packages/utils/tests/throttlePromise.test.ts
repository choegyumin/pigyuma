import throttlePromise from '@/src/throttlePromise';

const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

describe('throttlePromise', () => {
  test('should resolve all promises', async function () {
    let count = 0;
    const throttleTime = 100;
    const throttled = throttlePromise(() => ++count, throttleTime);

    const delayTime = 35;

    const promises: Array<ReturnType<typeof throttled>> = [];

    // 0ms
    promises.push(throttled());

    await expect(promises[0]).resolves.toBe(1);

    await wait(delayTime); // 35ms
    promises.push(throttled());
    await wait(delayTime); // 70ms
    promises.push(throttled());

    await expect(promises[1]).resolves.toBe(2);
    await expect(promises[2]).resolves.toBe(2);

    await wait(delayTime); // 105ms
    promises.push(throttled());
    await wait(delayTime); // 140ms
    promises.push(throttled());
    await wait(delayTime); // 175ms
    promises.push(throttled());

    await expect(promises[3]).resolves.toBe(3);
    await expect(promises[4]).resolves.toBe(3);
    await expect(promises[5]).resolves.toBe(3);
  });

  test('should reject promises except last one', async function () {
    const throttled = throttlePromise(() => 'value', 100, { reject: true });

    const promises: Array<ReturnType<typeof throttled>> = [];
    promises.push(throttled(), throttled(), throttled());

    await expect(promises[0]).rejects.toBe(undefined);
    await expect(promises[1]).rejects.toBe(undefined);
    await expect(promises[2]).resolves.toBe('value');
  });
});
