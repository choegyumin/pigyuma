import { UIRecordKey } from '@/types/Identifier';
import { UIRecordRect } from '@/types/Shape';
import ReactTypes from '@pigyuma/react-utility-types';
import { UIRecord } from '../UIRecord/UIRecord.model';

export const HandlePlacement = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  topLeft: 'topLeft',
  topRight: 'topRight',
  bottomRight: 'bottomRight',
  bottomLeft: 'bottomLeft',
} as const;
export type HandlePlacement = keyof typeof HandlePlacement;

export type TransformOverlayTransformEvent = {
  target: HTMLElement | null;
  record: UIRecord | undefined;
  type: 'resizing' | 'resizingFromCenter' | 'resizingCorner' | 'resizingCornerFromCenter' | 'rotating';
  rect: UIRecordRect;
};

export type TransformOverlayProps = ReactTypes.UnknownProps;

export type TransformOverlayRendererProps = {
  recordKey?: UIRecordKey;
  onResizeHandleMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
  onDocumentMouseUpForResize: (event: MouseEvent) => void;
  onDocumentMouseMoveForResize: (event: MouseEvent) => void;
  onDocuemntKeyDownUpForResize: (event: KeyboardEvent) => void;
  onRotateHandleMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
  onDocumentMouseUpForRotate: (event: MouseEvent) => void;
  onDocumentMouseMoveForRotate: (event: MouseEvent) => void;
};