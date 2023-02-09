import toCorrectFloat from './toCorrectFloat';
import toDegrees360 from './toDegrees360';
import toRadians from './toRadians';
import toUnsignedZero from './toUnsignedZero';

type Rect = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  degrees?: number;
};

export default function calcRectPoints({ x = 0, y = 0, width, height, degrees = 0 }: Rect) {
  degrees = toDegrees360(degrees);
  const radians = toRadians(degrees);
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const p1 = {
    x: toUnsignedZero(toCorrectFloat(-halfWidth * cos - -halfHeight * sin + (x + halfWidth))),
    y: toUnsignedZero(toCorrectFloat(-halfWidth * sin + -halfHeight * cos + (y + halfHeight))),
  };
  const p2 = {
    x: toUnsignedZero(toCorrectFloat(halfWidth * cos - -halfHeight * sin + (x + halfWidth))),
    y: toUnsignedZero(toCorrectFloat(halfWidth * sin + -halfHeight * cos + (y + halfHeight))),
  };
  const p3 = {
    x: toUnsignedZero(toCorrectFloat(halfWidth * cos - halfHeight * sin + (x + halfWidth))),
    y: toUnsignedZero(toCorrectFloat(halfWidth * sin + halfHeight * cos + (y + halfHeight))),
  };
  const p4 = {
    x: toUnsignedZero(toCorrectFloat(-halfWidth * cos - halfHeight * sin + (x + halfWidth))),
    y: toUnsignedZero(toCorrectFloat(-halfWidth * sin + halfHeight * cos + (y + halfHeight))),
  };

  if (0 < degrees && degrees <= 90) {
    return {
      p1: { x: p4.x, y: p2.y },
      p2: { x: p3.x, y: p1.y },
      p3: { x: p2.x, y: p4.y },
      p4: { x: p1.x, y: p3.y },
    };
  }

  if (90 < degrees && degrees <= 180) {
    return {
      p1: { x: p3.x, y: p3.y },
      p2: { x: p4.x, y: p4.y },
      p3: { x: p1.x, y: p1.y },
      p4: { x: p2.x, y: p2.y },
    };
  }

  if (180 < degrees && degrees <= 270) {
    return {
      p1: { x: p2.x, y: p4.y },
      p2: { x: p1.x, y: p3.y },
      p3: { x: p4.x, y: p2.y },
      p4: { x: p3.x, y: p1.y },
    };
  }

  // (270 < degrees && degrees <= 360) || degrees === 0
  return { p1, p2, p3, p4 };
}
