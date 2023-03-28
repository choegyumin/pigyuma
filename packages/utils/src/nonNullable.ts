export default function nonNullable<T>(value: T | null | undefined): value is NonNullable<T> {
  return value != null;
}
