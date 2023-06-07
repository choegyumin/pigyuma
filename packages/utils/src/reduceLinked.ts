export interface ReduceLinkedOptions<T = undefined> {
  self?: boolean;
  initialValue?: T;
}

type Prop<T> = keyof T;

type GetProp<T> = (value?: T) => Prop<T>;

type Reducer<T, R> = (accumulator: R, value: T) => R;

function reduceLinked<T extends object>(
  item: T | undefined,
  prop: Prop<T> | GetProp<T>,
  reducer: Reducer<T, T>,
  options?: ReduceLinkedOptions<T>,
): T | undefined;
function reduceLinked<T extends object, U>(
  item: T | undefined,
  prop: Prop<T> | GetProp<T>,
  reducer: Reducer<T, U>,
  options: ReduceLinkedOptions<U>,
): 'initialValue' extends keyof typeof options ? U : U | undefined;
function reduceLinked<T extends object, U = T>(
  item: T | undefined,
  prop: Prop<T> | GetProp<T>,
  reducer: Reducer<T, U>,
  options: ReduceLinkedOptions<U> = {},
): 'initialValue' extends keyof typeof options ? U : U | undefined {
  const { self = false, initialValue } = options;

  const getNext = (current?: T) => {
    const key = typeof prop === 'function' ? prop(current) : prop;
    return current?.[key as keyof typeof current] as T;
  };

  let accumulator: U | undefined = initialValue;
  let current = self ? item : getNext(item);

  while (true) {
    if (current == null || typeof current !== 'object') {
      return accumulator as 'initialValue' extends keyof typeof options ? U : U | undefined;
    }
    if (accumulator === undefined) {
      accumulator = current as unknown as U;
    } else {
      accumulator = reducer(accumulator, current);
    }
    current = getNext(current);
  }
}

export default reduceLinked;
