import { UIRecordQuad, UIRecordQuadInit, UIRecordRect, UIRecordRectInit } from '@/types/Geometry';
import { HandlePlacement } from '@/types/Identifier';
import { calcCoordByDistance, calcDegreesBetweenCoords, calcDistancePointFromLine, pick, toDegrees360 } from '@pigyuma/utils';

export const calcMovedRect = (
  rect: UIRecordRect,
  mousePoint: { x: number; y: number },
  handleCoord: { x: number; y: number },
): UIRecordRect => {
  const newRectInit: UIRecordRectInit = pick(rect, ['x', 'y', 'width', 'height', 'rotate']);

  newRectInit.x = newRectInit.x + (mousePoint.x - handleCoord.x);
  newRectInit.y = newRectInit.y + (mousePoint.y - handleCoord.y);

  return UIRecordRect.fromRect(newRectInit);
};

interface CalcResizedRectOptions {
  precision?: boolean;
  fromCenter?: boolean;
}

export const calcResizedRect = (
  rect: UIRecordRect,
  mousePoint: { x: number; y: number },
  handlePlacement: HandlePlacement,
  options: CalcResizedRectOptions = {},
): UIRecordRect => {
  const { precision = false, fromCenter = false } = options;

  const fixValue = precision ? (value: number) => value : (value: number) => Math.round(value);

  const quad = UIRecordQuad.fromRect(rect);

  const newQuadInit: UIRecordQuadInit = quad.toJSON();

  const getDiff = (distance: number) => distance * (fromCenter ? 2 : 1);

  const left = (flip = false) => {
    let distance = -calcDistancePointFromLine([newQuadInit.p1, newQuadInit.p4], mousePoint, { abs: false });
    // 값이 -1과 1 사이일 때 보정 (0은 그릴 수 없음)
    if (Math.abs(rect.width + getDiff(distance)) < 1) {
      distance += 1;
    }
    newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 180, flip ? -distance : distance);
    newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 180, flip ? -distance : distance);
    if (fromCenter) {
      newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 180, flip ? distance : -distance);
      newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 180, flip ? distance : -distance);
    }
    return rect.width + getDiff(distance) < 0;
  };
  const right = (flip = false) => {
    let distance = calcDistancePointFromLine([newQuadInit.p2, newQuadInit.p3], mousePoint, { abs: false });
    // 값이 -1과 1 사이일 때 보정 (0은 그릴 수 없음)
    if (Math.abs(rect.width + getDiff(distance)) < 1) {
      distance += 1;
    }
    newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 0, flip ? -distance : distance);
    newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 0, flip ? -distance : distance);
    if (fromCenter) {
      newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 0, flip ? distance : -distance);
      newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 0, flip ? distance : -distance);
    }
    return rect.width + getDiff(distance) < 0;
  };
  const top = () => {
    let distance = calcDistancePointFromLine([newQuadInit.p1, newQuadInit.p2], mousePoint, { abs: false });
    // 값이 -1과 1 사이일 때 보정 (0은 그릴 수 없음)
    if (Math.abs(rect.height + getDiff(distance)) < 1) {
      distance += 1;
    }
    newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 90, distance);
    newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 90, distance);
    if (fromCenter) {
      newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 90, -distance);
      newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 90, -distance);
    }
    return rect.height + getDiff(distance) < 0;
  };
  const bottom = () => {
    let distance = -calcDistancePointFromLine([newQuadInit.p4, newQuadInit.p3], mousePoint, { abs: false });
    // 값이 -1과 1 사이일 때 보정 (0은 그릴 수 없음)
    if (Math.abs(rect.height + getDiff(distance)) < 1) {
      distance += 1;
    }
    newQuadInit.p4 = calcCoordByDistance(newQuadInit.p4, rect.rotate + 270, distance);
    newQuadInit.p3 = calcCoordByDistance(newQuadInit.p3, rect.rotate + 270, distance);
    if (fromCenter) {
      newQuadInit.p1 = calcCoordByDistance(newQuadInit.p1, rect.rotate + 270, -distance);
      newQuadInit.p2 = calcCoordByDistance(newQuadInit.p2, rect.rotate + 270, -distance);
    }
    return rect.height + getDiff(distance) < 0;
  };

  // prettier-ignore
  switch (handlePlacement) {
    case HandlePlacement.top: { top(); break; }
    case HandlePlacement.left: { left(); break; }
    case HandlePlacement.right: { right(); break; }
    case HandlePlacement.bottom: { bottom(); break; }
    case HandlePlacement.topLeft: { left(top()); break; }
    case HandlePlacement.topRight: { right(top()); break; }
    case HandlePlacement.bottomLeft: { left(bottom()); break; }
    case HandlePlacement.bottomRight: { right(bottom()); break; }
  }

  const newRectInit: UIRecordRectInit = pick(UIRecordQuad.fromQuad(newQuadInit).getLayout().toJSON(), [
    'x',
    'y',
    'width',
    'height',
    'rotate',
  ]);

  newRectInit.x = fixValue(newRectInit.x);
  newRectInit.y = fixValue(newRectInit.y);
  newRectInit.width = Math.max(fixValue(newRectInit.width), 1);
  newRectInit.height = Math.max(fixValue(newRectInit.height), 1);
  newRectInit.rotate = rect.rotate;

  return UIRecordRect.fromRect(newRectInit);
};

interface CalcRotatedRectOptions {
  precision?: boolean;
}

export const calcRotatedRect = (
  rect: UIRecordRect,
  rotate: number,
  mousePoint: { x: number; y: number },
  handleCoordDegrees: number,
  options: CalcRotatedRectOptions = {},
): UIRecordRect => {
  const { precision = false } = options;

  const fixValue = precision ? (value: number) => value : (value: number) => Math.round(value);

  // rect.rotate는 조상을 포함해 계산된 값이므로, rotate를 사용함
  const newRectInit: UIRecordRectInit = pick(rect, ['x', 'y', 'width', 'height', 'rotate']);

  let newRotate = calcDegreesBetweenCoords(
    {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    },
    mousePoint,
  );
  newRotate -= handleCoordDegrees;
  newRotate += rotate;
  newRotate = fixValue(newRotate);

  newRectInit.rotate = toDegrees360(newRotate);

  return UIRecordRect.fromRect(newRectInit);
};
