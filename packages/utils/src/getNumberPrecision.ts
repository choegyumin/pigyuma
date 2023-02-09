import toFixedFraction from './toFixedFraction';

export default function getNumberPrecision(value: number) {
  const [absIntegerString = '', decimalStr = ''] = toFixedFraction(Math.abs(value)).split('.');
  const integerPrecision = absIntegerString === '0' ? 0 : absIntegerString.length;
  const decimalPrecision = decimalStr.length;
  return integerPrecision + decimalPrecision;
}
