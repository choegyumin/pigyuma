import toUnsignedZero from './toUnsignedZero';

export default function toDegrees360(degrees: number) {
  const full = 360;
  const limit = full;
  let degrees360 = degrees;
  while (degrees360 < 0) {
    degrees360 += full;
  }
  while (degrees360 >= limit) {
    degrees360 -= full;
  }
  return toUnsignedZero(degrees360);
}
