import toUnsignedZero from './toUnsignedZero';

export default function toDegrees(radians: number) {
  return toUnsignedZero(radians * (180 / Math.PI));
}
