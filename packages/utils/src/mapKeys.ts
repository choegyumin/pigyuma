/** @see _.mapKeys {@link https://lodash.com/docs/#mapKeys} */
export default function mapKeys<K extends PropertyKey, T extends object>(
  object: T,
  callback: (value: ValueOf<T>, key: keyof T, object: T) => K,
) {
  return (Object.entries(object) as [keyof T, ValueOf<T>][]).reduce((newObject, [key, value]) => {
    newObject[callback(value, key, object)] = value;
    return newObject;
  }, {} as { [P in K]: ValueOf<T> });
}
