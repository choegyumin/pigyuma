import React, { useRef } from 'react';
import { AxisGridRef } from '../AxisGrid/types';
import { HoveringOverlayRef } from '../HoveringOverlay/types';
import { TransformOverlayRef } from '../TransformOverlay/types';
import { EventControllerProps, EventControllerRef } from './types';

export type UseDataDependencys = {
  props: EventControllerProps;
  ref: React.ForwardedRef<EventControllerRef>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const axisGridRef = useRef<AxisGridRef>(null);
  const hoveringOverlayRef = useRef<HoveringOverlayRef>(null);
  const transformOverlayRef = useRef<TransformOverlayRef>(null);

  const clickedTargetRef = useRef<EventTarget | null>(null);

  return {
    axisGridRef,
    hoveringOverlayRef,
    transformOverlayRef,
    clickedTargetRef,
  };
}

export type UseDataType = ReturnType<typeof useData>;
