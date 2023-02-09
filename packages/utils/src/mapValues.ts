/** @see _.mapValues {@link https://lodash.com/docs/#mapValues} */
export default function mapValues<V, T extends object>(object: T, callback: (value: ValueOf<T>, key: keyof T, object: T) => V) {
  return (Object.entries(object) as [keyof T, ValueOf<T>][]).reduce((newObject, [key, value]) => {
    newObject[key] = callback(value, key, object);
    return newObject;
  }, {} as { [P in keyof T]: V });
}
