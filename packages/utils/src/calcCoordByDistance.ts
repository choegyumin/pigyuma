import toCorrectFloat from './toCorrectFloat';
import toRadians from './toRadians';
import toUnsignedZero from './toUnsignedZero';

export interface CalcCoordByDistanceOptions {
  graph?: boolean;
}

export default function calcCoordByDistance(
  point: { x: number; y: number },
  degrees: number,
  distance: number,
  options: CalcCoordByDistanceOptions = {},
) {
  const { graph = false } = options;
  const radians = toRadians(degrees);
  const x = toUnsignedZero(toCorrectFloat(point.x + Math.cos(radians) * distance));
  const y = toUnsignedZero(toCorrectFloat(point.y + Math.sin(radians) * (graph ? distance : -distance)));
  return { x, y };
}
