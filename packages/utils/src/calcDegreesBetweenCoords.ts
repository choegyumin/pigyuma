import toDegrees from './toDegrees';
import toDegrees180 from './toDegrees180';

type Options = {
  graph?: boolean;
};

export default function calcDegreesBetweenCoords(start: { x: number; y: number }, end: { x: number; y: number }, options: Options = {}) {
  const { graph = false } = options;
  const radians = Math.atan2(end.y - start.y, end.x - start.x);
  return toDegrees180(toDegrees(graph ? radians : -radians));
}
