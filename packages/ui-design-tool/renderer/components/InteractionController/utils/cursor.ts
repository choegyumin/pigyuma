import { HandlePlacement } from '@/types/Identifier';
import { cursor } from '@pigyuma/css-utils';

export const getMovingCursor = () => 'default';

export const getResizingCursor = (rotate: number, handlePlacement: HandlePlacement) => {
  return cursor.resizeMap(rotate)[handlePlacement];
};

export const getResizingCornerCursor = (element: Element, mousePoint: { x: number; y: number }) => {
  const rect = element.getBoundingClientRect();
  return cursor.resizePoint({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mousePoint);
};

export const getRotatingCursor = (element: Element, mousePoint: { x: number; y: number }) => {
  const rect = element.getBoundingClientRect();
  return cursor.rotatePoint({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, mousePoint);
};

export const getDrawingCursor = () => 'crosshair';
