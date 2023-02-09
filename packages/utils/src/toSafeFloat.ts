import toFinite from 'lodash-es/toFinite';
import getIntegerPrecision from './getIntegerPrecision';

/** 최대 소수 자릿수는 17자리이지만 16자리까지만 안전한 값을 보장함 */
export const MAX_SAFE_PRECISION = 16;

export default function toSafeFloat(value: number) {
  /** @see toSafeInteger {@link https://github.com/lodash/lodash/blob/3b302b822c9e94f0444f356cc156f9c0e1667dde/toSafeInteger.js#L29-L38} */
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

  const integerPrecision = getIntegerPrecision(value);
  return Number(value.toFixed(MAX_SAFE_PRECISION - integerPrecision));
}
