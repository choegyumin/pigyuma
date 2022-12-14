import toRadians from './toRadians';
import toSafeFloat from './toSafeFloat';
import toUnsignedZero from './toUnsignedZero';

type Options = {
  graph?: boolean;
};

export default function calcCoordByDistance(point: { x: number; y: number }, degrees: number, distance: number, options: Options = {}) {
  const { graph = false } = options;
  const radians = toRadians(degrees);
  const x = toUnsignedZero(toSafeFloat(point.x + Math.cos(radians) * distance));
  const y = toUnsignedZero(toSafeFloat(point.y + Math.sin(radians) * (graph ? distance : -distance)));
  return { x, y };
}
