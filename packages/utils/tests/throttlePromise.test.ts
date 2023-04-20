import throttlePromise from '@/src/throttlePromise';

const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

describe('throttlePromise', () => {
  test('should resolve all promises', async function () {
    let count = 0;
    const throttleTime = 250;
    const throttled = throttlePromise(() => ++count, throttleTime);

    const delay = throttleTime + 4;

    // `leading` is true (1)
    expect(throttled()).resolves.toBe(1);
    expect(throttled()).resolves.toBe(1);
    expect(throttled()).resolves.toBe(1);

    // `trailing` is true (2)
    await wait(delay);

    // `leading` is true (3)
    expect(throttled()).resolves.toBe(3);
    expect(throttled()).resolves.toBe(3);
    expect(throttled()).resolves.toBe(3);
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
