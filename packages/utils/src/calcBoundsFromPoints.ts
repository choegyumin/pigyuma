type Coord = { x: number; y: number };

type Points = {
  p1: Coord;
  p2: Coord;
  p3: Coord;
  p4: Coord;
};

export default function calcBoundsFromPoints({ p1, p2, p3, p4 }: Points) {
  const points = [p1, p2, p3, p4];
  const xCoords = points.map((c) => c.x);
  const yCoords = points.map((c) => c.y);

  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
