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

export const calcResizedRect = (
  rect: UIRecordRect,
  mousePoint: { x: number; y: number },
  handlePlacement: HandlePlacement,
  fromCenter: boolean,
): UIRecordRect => {
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

  switch (handlePlacement) {
    // prettier-ignore
    case HandlePlacement.top: { top(); break; }
    // prettier-ignore
    case HandlePlacement.left: { left(); break; }
    // prettier-ignore
    case HandlePlacement.right: { right(); break; }
    // prettier-ignore
    case HandlePlacement.bottom: { bottom(); break; }
    // prettier-ignore
    case HandlePlacement.topLeft: { left(top()); break; }
    // prettier-ignore
    case HandlePlacement.topRight: { right(top()); break; }
    // prettier-ignore
    case HandlePlacement.bottomLeft: { left(bottom()); break; }
    // prettier-ignore
    case HandlePlacement.bottomRight: { right(bottom()); break; }
  }

  const newRectInit: UIRecordRectInit = pick(UIRecordQuad.fromQuad(newQuadInit).getLayout().toJSON(), [
    'x',
    'y',
    'width',
    'height',
    'rotate',
  ]);

  newRectInit.x = Math.round(newRectInit.x);
  newRectInit.y = Math.round(newRectInit.y);
  newRectInit.width = Math.max(Math.round(newRectInit.width), 1);
  newRectInit.height = Math.max(Math.round(newRectInit.height), 1);
  newRectInit.rotate = rect.rotate;

  return UIRecordRect.fromRect(newRectInit);
};

export const calcRotatedRect = (rect: UIRecordRect, mousePoint: { x: number; y: number }, handleCoordDegrees: number): UIRecordRect => {
  const newRectInit: UIRecordRectInit = pick(rect, ['x', 'y', 'width', 'height', 'rotate']);

  let rotate = calcDegreesBetweenCoords(
    {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    },
    mousePoint,
  );
  rotate -= handleCoordDegrees;
  rotate += rect.rotate;
  rotate = Math.round(rotate);

  newRectInit.rotate = toDegrees360(rotate);

  return UIRecordRect.fromRect(newRectInit);
};
