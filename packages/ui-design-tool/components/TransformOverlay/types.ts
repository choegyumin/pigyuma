export const OvrlayState = {
  idle: 'idle',
  resizing: 'resizing',
  rotating: 'rotating',
} as const;
export type OvrlayState = keyof typeof OvrlayState;

export const ResizingHandleTarget = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  topLeft: 'topLeft',
  topRight: 'topRight',
  bottomRight: 'bottomRight',
  bottomLeft: 'bottomLeft',
};
export type ResizingHandleTarget = keyof typeof ResizingHandleTarget;

export type TransformOverlayTransformEvent = { target: HTMLElement | null };
export type TransformOverlayResizeEvent = { target: HTMLElement | null; x: string; y: string; width: string; height: string };
export type TransformOverlayRotateEvent = { target: HTMLElement | null; degrees: string };

export type TransformOverlayProps = {
  onTransformStart?: (event: TransformOverlayTransformEvent) => void;
  onTransformEnd?: (event: TransformOverlayTransformEvent) => void;
  onResizeStart?: (event: TransformOverlayResizeEvent) => void;
  onResize?: (event: TransformOverlayResizeEvent) => void;
  onResizeEnd?: (event: TransformOverlayResizeEvent) => void;
  onRotateStart?: (event: TransformOverlayRotateEvent) => void;
  onRotate?: (event: TransformOverlayRotateEvent) => void;
  onRotateEnd?: (event: TransformOverlayRotateEvent) => void;
};

export type TransformOverlayRef = {
  select: (layer: HTMLElement) => void;
  deselect: () => void;
  transform: (
    layer: HTMLElement,
    style: { x?: string | null; y?: string | null; width?: string | null; height?: string | null; degrees?: string | null },
  ) => void;
};
