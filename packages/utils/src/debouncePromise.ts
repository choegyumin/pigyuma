import debounce, { DebouncedFuncLeading, DebounceSettings } from 'lodash-es/debounce';

export interface DebouncePromiseSettings extends DebounceSettings {
  reject?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function debouncePromise<T extends (...args: any[]) => any, V extends Awaited<ReturnType<T>>>(
  func: T,
  wait?: number,
  options?: DebouncePromiseSettings,
): DebouncedFuncLeading<T> {
  let promise: Promise<V>;
  let queue: Array<{ resolve: PromiseResolve<V>; reject: PromiseReject }> = [];

  const register = (resolve: PromiseResolve<V>, reject: PromiseReject) => {
    queue.push({ resolve, reject });
  };

  const resolve = (value: V) => {
    queue.forEach(({ resolve }) => resolve(value));
    queue = [];
  };

  const reject = () => {
    queue.forEach(({ reject }) => reject());
    queue = [];
  };

  const debounced = debounce(
    async (...args) => {
      const result = await func(...args);
      resolve(result);
    },
    wait,
    options,
  );

  const flush = (): Promise<V> => {
    debounced.flush();
    return promise;
  };

  const cancel = (): void => {
    debounced.cancel();
    reject();
  };

  const callback = (...args: Parameters<T>) => {
    if (options?.reject) {
      reject();
    }
    promise = new Promise<V>((resolve, reject) => {
      register(resolve, reject);
    });
    debounced(...args);
    return promise;
  };

  return Object.assign(callback, { cancel, flush }) as DebouncedFuncLeading<T>;
}
