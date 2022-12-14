import toUnsignedZero from './toUnsignedZero';

export default function convertCSSDegrees(degrees: number) {
  // Convert between CW and CCW
  return toUnsignedZero(-(degrees - 90));
}
