import calcBoundsFromPoints from './calcBoundsFromPoints';
import toCorrectFloat from './toCorrectFloat';

type Coord = { x: number; y: number };

type Points = {
  p1: Coord;
  p2: Coord;
  p3: Coord;
  p4: Coord;
};

export default function calcLayoutFromPoints({ p1, p2, p3, p4 }: Points) {
  const points = [p1, p2, p3, p4];
  const xCoords = points.map((c) => c.x);
  const yCoords = points.map((c) => c.y);

  const minX = Math.min(...xCoords);
  const minY = Math.min(...yCoords);

  const bounds = calcBoundsFromPoints({ p1, p2, p3, p4 });
  const layoutWidth = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  const layoutHeight = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));

  const layoutX = minX + (bounds.width - layoutWidth) / 2;
  const layoutY = minY + (bounds.height - layoutHeight) / 2;

  return {
    x: toCorrectFloat(layoutX),
    y: toCorrectFloat(layoutY),
    width: toCorrectFloat(layoutWidth),
    height: toCorrectFloat(layoutHeight),
  };
}
