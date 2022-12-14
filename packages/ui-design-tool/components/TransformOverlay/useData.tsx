import { UIRecordRect } from '@/types/Shape';
import { useDOMStyle } from '@pigyuma/react-utils';
import { useRef } from 'react';
import { OvrlayState, ResizingHandleTarget, TransformOverlayProps, TransformOverlayRef } from '../TransformOverlay/types';
import * as styles from './TransformOverlay.css';

export type UseDataDependencys = {
  props: TransformOverlayProps;
  ref: React.ForwardedRef<TransformOverlayRef>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const selectedLayerRef = useRef<HTMLElement | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const transformTextRef = useRef<HTMLSpanElement>(null);

  const overlayStateRef = useRef<OvrlayState>(OvrlayState.idle);

  const transformInitialStyleRef = useRef<{ x: string; y: string; width: string; height: string; degrees: string }>();
  const transformInitialRectRef = useRef<UIRecordRect>();

  const resizingHandleTargetRef = useRef<ResizingHandleTarget>();

  const rotatingHandleCoordDegreesRef = useRef<number>();
  const rotatingLayerInitialDegreesRef = useRef<number>();

  const [rootStyle, setRootStyle] = useDOMStyle(
    {
      [styles.varNames.visibility]: 'hidden',
      [styles.varNames.x]: 0,
      [styles.varNames.y]: 0,
      [styles.varNames.width]: 0,
      [styles.varNames.height]: 0,
      [styles.varNames.degrees]: 0,
      [styles.varNames.outlineOpacity]: 0,
      [styles.varNames.resizeHandleOpacity]: 0,
      [styles.varNames.transformOpacity]: 0,
    },
    () => [rootRef.current],
  );

  return {
    selectedLayerRef,
    rootRef,
    transformTextRef,
    overlayStateRef,
    transformInitialStyleRef,
    transformInitialRectRef,
    resizingHandleTargetRef,
    rotatingHandleCoordDegreesRef,
    rotatingLayerInitialDegreesRef,
    rootStyle,
    setRootStyle,
  };
}

export type UseDataType = ReturnType<typeof useData>;
