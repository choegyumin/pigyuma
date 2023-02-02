import { useDOMStyle } from '@pigyuma/react-utils';
import { useRef, useState } from 'react';
import { UIRecord } from '../UIRecord/UIRecord.model';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import * as styles from './SelectionOverlay.css';
import { SelectionOverlayProps, SelectionOverlayRef } from './types';

export type UseDataDependencys = {
  api: UIDesignToolAPI;
  props: SelectionOverlayProps;
  ref: React.ForwardedRef<SelectionOverlayRef>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const hoveredRecordRef = useRef<UIRecord>();
  const clickedTargetRef = useRef<EventTarget | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  const [rootStyle, setRootStyle] = useDOMStyle(
    {
      [styles.varNames.visibility]: 'hidden',
      [styles.varNames.x]: 0,
      [styles.varNames.y]: 0,
      [styles.varNames.width]: 0,
      [styles.varNames.height]: 0,
      [styles.varNames.rotate]: 0,
    },
    () => [rootRef.current],
  );

  const [active, setActive] = useState<boolean>(false);

  return {
    hoveredRecordRef,
    clickedTargetRef,
    rootRef,
    rootStyle,
    setRootStyle,
    active,
    setActive,
  };
}

export type UseDataType = ReturnType<typeof useData>;
