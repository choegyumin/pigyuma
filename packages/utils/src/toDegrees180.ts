import toUnsignedZero from './toUnsignedZero';

export default function toDegrees180(degrees: number) {
  const full = 360;
  const limit = full / 2;
  let degrees180 = degrees;
  while (degrees180 <= -limit) {
    degrees180 += full;
  }
  while (degrees180 > limit) {
    degrees180 -= full;
  }
  return toUnsignedZero(degrees180);
}
