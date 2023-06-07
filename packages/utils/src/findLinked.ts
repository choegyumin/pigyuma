export interface FindLinkedOptions {
  self?: boolean;
}

type Prop<T> = keyof T;
type PropWithResult<T, R> = keyof (T & R);

type GetProp<T> = (value?: T) => Prop<T>;
type GetPropWithResult<T, R> = (value?: T | R) => PropWithResult<T, R>;

type Predicate<T> = (value: T) => boolean;
type PredicateWithResult<T, R> = (value: T | R) => boolean;

function findLinked<T extends object>(
  item: T | undefined,
  prop: Prop<T> | GetProp<T>,
  predicate: Predicate<T>,
  options?: FindLinkedOptions,
): T | undefined;
function findLinked<T extends object, R extends object>(
  item: T | undefined,
  prop: PropWithResult<T, R> | GetPropWithResult<T, R>,
  predicate: PredicateWithResult<T, R>,
  options?: FindLinkedOptions,
): R | undefined;
function findLinked<T extends object, R extends object = T>(
  item: T | undefined,
  prop: PropWithResult<T, R> | GetPropWithResult<T, R>,
  predicate: PredicateWithResult<T, R>,
  options: FindLinkedOptions = {},
): R | undefined {
  const { self = false } = options;

  const getNext = (current?: T | R) => {
    const key = typeof prop === 'function' ? prop(current) : prop;
    return current?.[key as keyof typeof current] as typeof current;
  };

  let found = self ? item : getNext(item);

  while (true) {
    if (found == null || typeof found !== 'object') {
      return undefined;
    }
    if (predicate(found)) {
      return found as R;
    }
    found = getNext(found);
  }
}

export default findLinked;
