import React, { useRef } from 'react';
import { AxisGridRef } from '../AxisGrid/types';
import { SelectionOverlayRef } from '../SelectionOverlay/types';
import { TransformOverlayRef } from '../TransformOverlay/types';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import { InteractionControllerProps, InteractionControllerRef } from './types';

export type UseDataDependencys = {
  api: UIDesignToolAPI;
  props: InteractionControllerProps;
  ref: React.ForwardedRef<InteractionControllerRef>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useData(deps: UseDataDependencys) {
  const axisGridRef = useRef<AxisGridRef>(null);
  const selectionOverlayRef = useRef<SelectionOverlayRef>(null);
  const transformOverlayRef = useRef<TransformOverlayRef>(null);

  const clickedTargetRef = useRef<EventTarget | null>(null);

  return {
    axisGridRef,
    selectionOverlayRef,
    transformOverlayRef,
    clickedTargetRef,
  };
}

export type UseDataType = ReturnType<typeof useData>;
