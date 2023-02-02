import { UIRecordRect } from '@/types/Shape';
import { useDOMStyle } from '@pigyuma/react-utils';
import { useRef } from 'react';
import { TransformStatus, ResizeHandlePlacement, TransformOverlayProps, TransformOverlayRef } from '../TransformOverlay/types';
import { UIRecord } from '../UIRecord/UIRecord.model';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import * as styles from './TransformOverlay.css';

export type UseDataDependencys = {
  api: UIDesignToolAPI;
  props: TransformOverlayProps;
  ref: React.ForwardedRef<TransformOverlayRef>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const selectedRecordRef = useRef<UIRecord>();

  const rootRef = useRef<HTMLDivElement>(null);
  const infoTextRef = useRef<HTMLSpanElement>(null);

  const transformStatusRef = useRef<TransformStatus>(TransformStatus.idle);

  const transformInitialRectRef = useRef<UIRecordRect>();
  const transformLastRectRef = useRef<UIRecordRect>();

  const resizingHandlePlacementRef = useRef<ResizeHandlePlacement>();

  const rotatingHandleCoordDegreesRef = useRef<number>();

  const [rootStyle, setRootStyle] = useDOMStyle(
    {
      [styles.varNames.x]: 0,
      [styles.varNames.y]: 0,
      [styles.varNames.width]: 0,
      [styles.varNames.height]: 0,
      [styles.varNames.rotate]: 0,
      [styles.varNames.visibility]: 'hidden',
      [styles.varNames.infoVisibility]: 'hidden',
      [styles.varNames.handleVisibility]: 'hidden',
      [styles.varNames.outlineVisibility]: 'hidden',
    },
    () => [rootRef.current],
  );

  return {
    selectedRecordRef,
    rootRef,
    infoTextRef,
    transformStatusRef,
    transformInitialRectRef,
    transformLastRectRef,
    resizingHandlePlacementRef,
    rotatingHandleCoordDegreesRef,
    rootStyle,
    setRootStyle,
  };
}

export type UseDataType = ReturnType<typeof useData>;
