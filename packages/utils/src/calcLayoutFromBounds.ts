import toRadians from './toRadians';

type Rect = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  degrees?: number;
};

/**
 * Convert `getBoundingClientRect` values to something like `clientX·Y·Width·Height`.
 * @deprecated
 * @see {@link https://stackoverflow.com/a/56281055}
 */
export default function UNSAFE_calcLayoutFromBounds({ x = 0, y = 0, width, height, degrees = 0 }: Rect) {
  const radians = toRadians(degrees);
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  const layoutWidth = (cos * width - sin * height) / (cos * cos - sin * sin);
  const layoutHeight = (cos * height - sin * width) / (cos * cos - sin * sin);
  const layoutX = x + (width - layoutWidth) / 2;
  const layoutY = y + (height - layoutHeight) / 2;

  return {
    x: layoutX,
    y: layoutY,
    width: layoutWidth,
    height: layoutHeight,
  };
}
