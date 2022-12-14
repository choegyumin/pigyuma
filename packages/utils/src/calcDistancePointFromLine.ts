import calcDistancePointFromPoint from './calcDistancePointFromPoint';
import toUnsignedZero from './toUnsignedZero';

export default function calcDistancePointFromLine(
  line: [{ x: number; y: number }, { x: number; y: number }],
  point: { x: number; y: number },
) {
  const [line1, line2] = line;
  if (line1.x === line2.x && line1.y === line2.y) {
    return calcDistancePointFromPoint(line1, point);
  }
  const a = line2.y - line1.y;
  const b = line1.x - line2.x;
  const c = line2.x * line1.y - line1.x * line2.y;

  /** @todo useResizeHandlers의 onMouseMoveForResize 함수 개선 후 절댓값으로 변경 */
  // return toUnsignedZero(Math.abs(a * point.x + b * point.y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) || 0);
  return toUnsignedZero((a * point.x + b * point.y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) || 0);
}
