import debouncePromise from '@/src/debouncePromise';

const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

describe('debouncePromise', () => {
  test('should resolve all promises', async function () {
    let count = 0;
    const debounceTime = 100;
    const debounced = debouncePromise(() => ++count, debounceTime);

    const lessDelay = debounceTime / 2;
    const moreDelay = debounceTime * 2;

    expect(debounced()).resolves.toBe(1);
    await wait(lessDelay);
    expect(debounced()).resolves.toBe(1);
    await wait(lessDelay);
    expect(debounced()).resolves.toBe(1);

    await wait(moreDelay);

    expect(debounced()).resolves.toBe(2);
    await wait(moreDelay);
    expect(debounced()).resolves.toBe(3);
    await wait(moreDelay);
    expect(debounced()).resolves.toBe(4);
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
