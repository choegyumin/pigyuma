export default function nonUndefined<T>(value: T | undefined): value is NonUndefined<T> {
  return value !== undefined;
}
