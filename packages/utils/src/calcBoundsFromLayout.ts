import toCorrectFloat from './toCorrectFloat';
import toRadians from './toRadians';

type Rect = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  degrees?: number;
};

/** Convert `clientX·Y·Width·Height` to something like `getBoundingClientRect` values. */
export default function calcBoundsFromLayout({ x = 0, y = 0, width, height, degrees = 0 }: Rect) {
  const radians = toRadians(degrees);
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  const boundingWidth = sin * height + cos * width;
  const boundingHeight = sin * width + cos * height;
  const boundingX = x - (boundingWidth - width) / 2;
  const boundingY = y - (boundingHeight - height) / 2;

  return {
    x: toCorrectFloat(boundingX),
    y: toCorrectFloat(boundingY),
    width: toCorrectFloat(boundingWidth),
    height: toCorrectFloat(boundingHeight),
  };
}
