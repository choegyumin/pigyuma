import { useDOMStyle } from '@pigyuma/react-utils';
import { useRef } from 'react';
import { HoveringOverlayProps, HoveringOverlayRef } from '../HoveringOverlay/types';
import * as styles from './HoveringOverlay.css';

export type UseDataDependencys = {
  props: HoveringOverlayProps;
  ref: React.ForwardedRef<HoveringOverlayRef>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const hoveredLayerRef = useRef<HTMLElement | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  const [rootStyle, setRootStyle] = useDOMStyle(
    {
      [styles.varNames.visibility]: 'hidden',
      [styles.varNames.x]: 0,
      [styles.varNames.y]: 0,
      [styles.varNames.width]: 0,
      [styles.varNames.height]: 0,
      [styles.varNames.degrees]: 0,
    },
    () => [rootRef.current],
  );

  return {
    hoveredLayerRef,
    rootRef,
    rootStyle,
    setRootStyle,
  };
}

export type UseDataType = ReturnType<typeof useData>;
