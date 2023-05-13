import getFloatPrecision from './getFloatPrecision';
import getNumberPrecision from './getNumberPrecision';
import toFixedFraction from './toFixedFraction';
import toSafeFloat from './toSafeFloat';

const REPEATING_DIGITS = 3;
const CUTOFF_DIGITS = 2;

/**
 * 부동 소수점 오차가 발생했을 때 계산된 값의 precision은
 * 최대 정수 자릿수인 15부터 최대 소수 자릿수인 17 사이에 해당됨.
 * See {@link https://www.mycompiler.io/view/BVDNBSp8iVF}
 */
export const MAX_CORRECT_PRECISION = 15;

/**
 * 부동 소수점 오류를 판별하기 위한 최소 소수 자릿수
 * 소수 자릿수에 따라 오차 값도 달라지므로 소수가 17자리를 초과해서는 안됨
 * See {@link https://www.mycompiler.io/view/BVDNBSp8iVF}
 *
 * 4.9712000000000005 =>
 * '9712' // 유효한 값
 * '000...' // 오차로 인한 순환 소수 (최소 3자리)
 * '05' // 오차 값 (2자리)
 *
 * 0.47999999999999954 =>
 * '4799' // 유효한 값
 * '999...' // 오차로 인한 순환 소수 (최소 3자리)
 * '54' // 오차 값 (2자리)
 */
export const MIN_FLOAT_ERROR_DIGITS_PRECISION = REPEATING_DIGITS + CUTOFF_DIGITS;

/**
 * 소수 값의 오차를 보정함.
 * 부동 소수점 오차를 피하려면 정수로 올려 계산 후 다시 소수로 변환해야 하지만,
 * 이미 계산된 값은 되돌릴 수 없으므로 계산이 끝난 값을 보정할 때 사용.
 */
export default function toCorrectFloat(value: number) {
  // 오차 값을 2자리로 줄이기 위해 안전한 수로 변환
  value = toSafeFloat(value);

  const precision = getNumberPrecision(value);
  if (precision <= MAX_CORRECT_PRECISION) {
    return value;
  }

  const floatPrecision = getFloatPrecision(value);
  if (floatPrecision <= MIN_FLOAT_ERROR_DIGITS_PRECISION) {
    return value;
  }

  const decimalString = toFixedFraction(value).split('.')[1] ?? '';

  // 오차 자리를 제외한 값이 순환 소수인지 확인
  const lastOf = (index: number) => decimalString.length - 1 - CUTOFF_DIGITS - index;
  if (decimalString[lastOf(0)] !== decimalString[lastOf(1)] || decimalString[lastOf(1)] !== decimalString[lastOf(2)]) {
    return value;
  }

  return Number(value.toFixed(Math.max(floatPrecision - CUTOFF_DIGITS, 0)));
}
