import { calcDegreesBetweenCoords, toDegrees360 } from '@pigyuma/utils';

export type CursorPlacement = 'topLeft' | 'top' | 'topRight' | 'right' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'left';
type CursorDict<T extends string> = Record<CursorPlacement, T>;

const cursorPlacementsForHuman = ['topLeft', 'top', 'topRight', 'right', 'bottomRight', 'bottom', 'bottomLeft', 'left'] as const;
const cursorPlacementsForAngle = ['right', 'topRight', 'top', 'topLeft', 'left', 'bottomLeft', 'bottom', 'bottomRight'] as const;

const nsResizeCursor = 'ns-resize';
const ewResizeCursor = 'ew-resize';
const nwseResizeCursor = 'nwse-resize';
const neswResizeCursor = 'nesw-resize';

const nwRotateCursor = 'var(--nw-rotate)';
const nRotateCursor = 'var(--n-rotate)';
const neRotateCursor = 'var(--ne-rotate)';
const eRotateCursor = 'var(--e-rotate)';
const seRotateCursor = 'var(--se-rotate)';
const sRotateCursor = 'var(--s-rotate)';
const swRotateCursor = 'var(--sw-rotate)';
const wRotateCursor = 'var(--w-rotate)';

const resizeCursorDict = {
  topLeft: nwseResizeCursor,
  top: nsResizeCursor,
  topRight: neswResizeCursor,
  right: ewResizeCursor,
  bottomRight: nwseResizeCursor,
  bottom: nsResizeCursor,
  bottomLeft: neswResizeCursor,
  left: ewResizeCursor,
} as const;

const rotateCursorDict = {
  topLeft: nwRotateCursor,
  top: nRotateCursor,
  topRight: neRotateCursor,
  right: eRotateCursor,
  bottomRight: seRotateCursor,
  bottom: sRotateCursor,
  bottomLeft: swRotateCursor,
  left: wRotateCursor,
} as const;

export type ResizeCursor = ValueOf<typeof resizeCursorDict>;

export type RotateCursor = ValueOf<typeof rotateCursorDict>;

const placementPoint = (axis: { x: number; y: number }, mouse: { x: number; y: number }): CursorPlacement => {
  const degrees = toDegrees360(calcDegreesBetweenCoords(axis, mouse));
  const oneEighthTurn = Math.round(degrees / 45);
  const index = oneEighthTurn % cursorPlacementsForAngle.length;
  return cursorPlacementsForAngle[index];
};

const resizePoint = (axis: { x: number; y: number }, mouse: { x: number; y: number }): ResizeCursor => {
  return resizeCursorDict[placementPoint(axis, mouse)];
};

const rotatePoint = (axis: { x: number; y: number }, mouse: { x: number; y: number }): RotateCursor => {
  return rotateCursorDict[placementPoint(axis, mouse)];
};

/**
 * Generate cursor placements
 */
const placementMap = (degrees: number): CursorDict<CursorPlacement> => {
  const placements: [
    CursorPlacement,
    CursorPlacement,
    CursorPlacement,
    CursorPlacement,
    CursorPlacement,
    CursorPlacement,
    CursorPlacement,
    CursorPlacement,
  ] = [...cursorPlacementsForHuman];

  const oneEighthTurn = Math.round(degrees / 45);

  for (let i = 0; i < oneEighthTurn; i++) {
    placements.unshift(placements.pop() as CursorPlacement);
  }

  return {
    topLeft: placements[0],
    top: placements[1],
    topRight: placements[2],
    right: placements[3],
    bottomRight: placements[4],
    bottom: placements[5],
    bottomLeft: placements[6],
    left: placements[7],
  };
};

/**
 * Generate resize cursors
 *
 * ```
 * 'nwse-resize'  'ns-resize'  'nesw-resize'
 * 'ew-resize'                   'ew-resize'
 * 'nesw-resize'  'ns-resize'  'nwse-resize'
 * ```
 */
const resizeMap = (degrees: number): CursorDict<ResizeCursor> => {
  const placements = placementMap(degrees);
  return {
    topLeft: resizeCursorDict[placements.topLeft],
    top: resizeCursorDict[placements.top],
    topRight: resizeCursorDict[placements.topRight],
    right: resizeCursorDict[placements.right],
    bottomRight: resizeCursorDict[placements.bottomRight],
    bottom: resizeCursorDict[placements.bottom],
    bottomLeft: resizeCursorDict[placements.bottomLeft],
    left: resizeCursorDict[placements.left],
  };
};

/**
 * Generate rotate cursors
 *
 * ```
 * 'var(--nw-rotate)'  'var(--n-rotate)'  'var(--ne-rotate)'
 * 'var(--w-rotate)'                       'var(--e-rotate)'
 * 'var(--sw-rotate)'  'var(--s-rotate)'  'var(--se-rotate)'
 * ```
 */
const rotateMap = (degrees: number): CursorDict<RotateCursor> => {
  const placements = placementMap(degrees);
  return {
    topLeft: rotateCursorDict[placements.topLeft],
    top: rotateCursorDict[placements.top],
    topRight: rotateCursorDict[placements.topRight],
    right: rotateCursorDict[placements.right],
    bottomRight: rotateCursorDict[placements.bottomRight],
    bottom: rotateCursorDict[placements.bottom],
    bottomLeft: rotateCursorDict[placements.bottomLeft],
    left: rotateCursorDict[placements.left],
  };
};

export const cursor = { placementPoint, resizePoint, rotatePoint, placementMap, resizeMap, rotateMap };
