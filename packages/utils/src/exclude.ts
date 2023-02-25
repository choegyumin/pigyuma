/**
 * Creates new array of values that not included in other provided `values`.
 * @example
 * exclude(
 *   ['a', 'a', 'b', 'b', 'c', 'c'],
 *   ['a', 'b'],
 * )
 * // returns ['c', 'c']
 */
function exclude<T>(array: ArrayLike<T>, values: ArrayLike<unknown>) {
  const table = new Set(Array.from<unknown>(values));
  return Array.from<T>(array).filter((it) => !table.has(it));
}

export default exclude;
