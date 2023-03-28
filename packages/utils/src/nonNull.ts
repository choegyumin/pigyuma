export default function nonNull<T>(value: T | null): value is NonNull<T> {
  return value !== null;
}
