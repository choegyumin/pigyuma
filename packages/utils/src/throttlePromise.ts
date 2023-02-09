import { DebouncedFuncLeading } from 'lodash-es/debounce';
import throttle, { ThrottleSettings } from 'lodash-es/throttle';

export interface ThrottlePromiseSettings extends ThrottleSettings {
  reject?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function throttlePromise<T extends (...args: any[]) => any, V extends Awaited<ReturnType<T>>>(
  func: T,
  wait?: number,
  options?: ThrottlePromiseSettings,
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

  const throttled = throttle(
    async (...args) => {
      const result = await func(...args);
      resolve(result);
    },
    wait,
    options,
  );

  const flush = (): Promise<V> => {
    throttled.flush();
    return promise;
  };

  const cancel = (): void => {
    throttled.cancel();
    reject();
  };

  const callback = (...args: Parameters<T>) => {
    if (options?.reject) {
      reject();
    }
    promise = new Promise<V>((resolve, reject) => {
      register(resolve, reject);
    });
    throttled(...args);
    return promise;
  };

  return Object.assign(callback, { cancel, flush }) as DebouncedFuncLeading<T>;
}
