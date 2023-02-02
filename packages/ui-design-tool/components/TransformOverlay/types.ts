import { UIRecordKey } from '@/types/Identifier';
import { UIRecordRect, UIRecordRectInit } from '@/types/Shape';
import { UIRecord } from '../UIRecord/UIRecord.model';

export const TransformStatus = {
  idle: 'idle',
  resizing: 'resizing',
  rotating: 'rotating',
} as const;
export type TransformStatus = keyof typeof TransformStatus;

export const ResizeHandlePlacement = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  topLeft: 'topLeft',
  topRight: 'topRight',
  bottomRight: 'bottomRight',
  bottomLeft: 'bottomLeft',
};
export type ResizeHandlePlacement = keyof typeof ResizeHandlePlacement;

export type TransformOverlayTransformEvent = {
  target: HTMLElement | null;
  record: UIRecord | undefined;
  type: 'resize' | 'rotate';
  rect: UIRecordRect;
};

export type TransformOverlayProps = {
  onTransformStart?: (event: TransformOverlayTransformEvent) => void;
  onTransform?: (event: TransformOverlayTransformEvent) => void;
  onTransformEnd?: (event: TransformOverlayTransformEvent) => void;
};

export type TransformOverlayRef = {
  select: (recordKey: UIRecordKey) => void;
  deselect: () => void;
  transform: (recordKey: UIRecordKey, rect: UIRecordRect | UIRecordRectInit) => void;
};
