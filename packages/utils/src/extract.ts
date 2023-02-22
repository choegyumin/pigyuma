/**
 * Creates new array of values that are included in other provided `values`.
 * @example
 * extract(
 *   ['a', 'a', 'b', 'b', 'c', 'c'],
 *   ['a', 'b'],
 * )
 * // returns ['a', 'a', 'b', 'b']
 */
function extract<T>(array: ArrayLike<T>, values: ArrayLike<unknown>) {
  const table = new Set(Array.from<unknown>(values));
  return Array.from<T>(array).filter((it) => table.has(it));
}

export default extract;
