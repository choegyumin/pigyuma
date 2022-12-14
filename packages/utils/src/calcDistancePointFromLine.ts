import calcDistancePointFromPoint from './calcDistancePointFromPoint';
import toUnsignedZero from './toUnsignedZero';

export interface CalcDistancePointFromLineOptions {
  abs?: boolean;
}

export default function calcDistancePointFromLine(
  line: [{ x: number; y: number }, { x: number; y: number }],
  point: { x: number; y: number },
  options: CalcDistancePointFromLineOptions = {},
) {
  const { abs = true } = options;
  const absFn = abs ? Math.abs : (x: number) => x;

  const [line1, line2] = line;
  if (line1.x === line2.x && line1.y === line2.y) {
    return calcDistancePointFromPoint(line1, point);
  }
  const a = line2.y - line1.y;
  const b = line1.x - line2.x;
  const c = line2.x * line1.y - line1.x * line2.y;

  return toUnsignedZero(absFn(a * point.x + b * point.y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) || 0);
}
