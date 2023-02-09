import toCorrectFloat from './toCorrectFloat';
import toUnsignedZero from './toUnsignedZero';

export default function calcDistancePointFromPoint(from: { x: number; y: number }, to: { x: number; y: number }) {
  const a = from.y - to.y;
  const b = to.x - from.x;
  return toUnsignedZero(toCorrectFloat(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) || 0));
}
