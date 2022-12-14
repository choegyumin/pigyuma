import { useDOMStyle } from '@pigyuma/react-utils';
import { useRef } from 'react';
import { AxisGridProps, AxisGridRef } from '../AxisGrid/types';
import * as styles from './AxisGrid.css';

export type UseDataDependencys = {
  props: AxisGridProps;
  ref: React.ForwardedRef<AxisGridRef>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [rootStyle, setRootStyle] = useDOMStyle(
    {
      [styles.varNames.visibility]: 'hidden',
      [styles.varNames.x]: 0,
      [styles.varNames.y]: 0,
      [styles.varNames.axisXLeft]: 'unset',
      [styles.varNames.axisXRight]: 'unset',
      [styles.varNames.axisXLength]: 0,
      [styles.varNames.axisYTop]: 'unset',
      [styles.varNames.axisYBottom]: 'unset',
      [styles.varNames.axisYLength]: 0,
    },
    () => [rootRef.current],
  );

  return {
    rootRef,
    rootStyle,
    setRootStyle,
  };
}

export type UseDataType = ReturnType<typeof useData>;
