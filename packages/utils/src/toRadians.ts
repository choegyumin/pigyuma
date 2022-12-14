import toUnsignedZero from './toUnsignedZero';

export default function toRadians(degrees: number) {
  return toUnsignedZero(degrees * (Math.PI / 180));
}
