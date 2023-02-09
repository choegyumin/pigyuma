import toFixedFraction from './toFixedFraction';

export default function getIntegerPrecision(value: number) {
  const [absIntegerString = ''] = toFixedFraction(Math.abs(value)).split('.');
  return absIntegerString === '0' ? 0 : absIntegerString.length;
}
