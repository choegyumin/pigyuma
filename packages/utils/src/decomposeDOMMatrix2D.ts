type Matrix2D = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
};

/** @todo 기울기 값 해결 후 테스트 코드 작성 */
export default function decomposeDOMMatrix2D(matrix: Matrix2D) {
  const angle = Math.atan2(matrix.b, matrix.a);
  const denom = Math.pow(matrix.a, 2) + Math.pow(matrix.b, 2);

  const rotate = angle / (Math.PI / 180);

  const scaleX = Math.sqrt(denom);
  const scaleY = (matrix.a * matrix.d - matrix.c * matrix.b) / scaleX;

  const skewX = Math.atan2(matrix.a * matrix.c + matrix.b * matrix.d, denom) / (Math.PI / 180);
  const skewY = 0;

  const translateX = matrix.e;
  const translateY = matrix.f;

  return { rotate, scaleX, scaleY, skewX, skewY, translateX, translateY };
}
