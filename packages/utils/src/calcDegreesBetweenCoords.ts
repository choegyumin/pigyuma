import toDegrees from './toDegrees';
import toDegrees180 from './toDegrees180';

export interface CalcDegreesBetweenCoordsOptions {
  graph?: boolean;
}

export default function calcDegreesBetweenCoords(
  start: { x: number; y: number },
  end: { x: number; y: number },
  options: CalcDegreesBetweenCoordsOptions = {},
) {
  const { graph = false } = options;
  const radians = Math.atan2(end.y - start.y, end.x - start.x);
  return toDegrees180(toDegrees(graph ? radians : -radians));
}
