export default function mapEntries<K extends PropertyKey, V, T extends object>(
  object: T,
  callback: (value: ValueOf<T>, key: keyof T, object: T) => [K, V],
) {
  return (Object.entries(object) as [keyof T, ValueOf<T>][]).reduce((newObject, [key, value]) => {
    const [newKey, newValue] = callback(value, key, object);
    newObject[newKey] = newValue;
    return newObject;
  }, {} as { [P in K]: V });
}
