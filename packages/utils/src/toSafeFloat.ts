import toFinite from 'lodash-es/toFinite';

// 15자리를 초과하는 소수는 오히려 오차를 유발함
// 계산 과정에서 사용하는 경우에도 오차를 유발하므로 더 이상 계산이 필요하지 않은 완성된 값에만 사용
const MAX_SAFE_FRACTION_DIGITS = 15;

export default function toSafeFloat(value: number) {
  /** @see toSafeInteger {@link lodash-es/toSafeInteger} */
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toFinite(value);
  if (value < Number.MIN_SAFE_INTEGER) {
    return Number.MIN_SAFE_INTEGER;
  }
  if (value > Number.MAX_SAFE_INTEGER) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Number(value.toFixed(MAX_SAFE_FRACTION_DIGITS));
}
