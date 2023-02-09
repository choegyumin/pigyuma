import toFixedFraction from './toFixedFraction';

export default function getFloatPrecision(value: number) {
  const [, decimalStr = ''] = toFixedFraction(Math.abs(value)).split('.');
  return decimalStr.length;
}
