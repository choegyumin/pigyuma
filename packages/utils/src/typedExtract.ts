import extract from './extract';

/**
 * Creates a new array by extracting from `array` all elements that are assignable to ReadonlyArray.
 * @example
 * typedExtract(
 *   ['a', 'a', 'b', 'c', 'c', 'd'] as const,
 *   ['a', 'b'] as const,
 * )
 * // returns ['c', 'c', 'd'] (type Array<'c' | 'd'>)
 */
function typedExtract<T, U>(array: ArrayLike<T>, values: readonly [...Array<U>]) {
  return extract(array, values) as Array<Extract<T, U>>;
}

export default typedExtract;
