import exclude from './exclude';

/**
 * Creates a new array by excluding from `array` all elements that are assignable to ReadonlyArray.
 * @example
 * typedExclude(
 *   ['a', 'a', 'b', 'c', 'c', 'd'] as const,
 *   ['a', 'b'] as const,
 * )
 * // returns ['a', 'a', 'b'] (type Array<'a' | 'b'>)
 */
function typedExclude<T, U>(array: ArrayLike<T>, values: readonly [...Array<U>]) {
  return exclude(array, values) as Array<Exclude<T, U>>;
}

export default typedExclude;
