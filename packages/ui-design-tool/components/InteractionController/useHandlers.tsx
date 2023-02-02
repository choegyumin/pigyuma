import { useEvent } from '@pigyuma/react-utils';
import { SelectionOverlayChangeEvent } from '../SelectionOverlay/types';
import { TransformOverlayTransformEvent } from '../TransformOverlay/types';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import { InteractionControllerProps, InteractionControllerRef } from './types';
import { UseDataType } from './useData';

export type UseHandlersDependencys = {
  api: UIDesignToolAPI;
  props: InteractionControllerProps;
  ref: React.ForwardedRef<InteractionControllerRef>;
  data: UseDataType;
};

export default function useHandlers(deps: UseHandlersDependencys) {
  const {
    data: { axisGridRef, transformOverlayRef, selectionOverlayRef },
  } = deps;

  const onSelectionChange = useEvent(({ record }: SelectionOverlayChangeEvent) => {
    if (record != null) {
      axisGridRef.current?.select(record.key);
      transformOverlayRef.current?.select(record.key);
    } else {
      axisGridRef.current?.deselect();
      transformOverlayRef.current?.deselect();
    }
  });

  const onTransformStart = useEvent(() => {
    axisGridRef.current?.deselect();
    selectionOverlayRef.current?.off();
  });

  const onTransform = useEvent(({ record, rect }: TransformOverlayTransformEvent) => {
    if (record != null) {
      transformOverlayRef.current?.transform(record.key, rect);
    }
  });

  const onTransformEnd = useEvent(({ record, rect }: TransformOverlayTransformEvent) => {
    if (record != null) {
      axisGridRef.current?.select(record.key);
      transformOverlayRef.current?.transform(record.key, rect);
    }
    selectionOverlayRef.current?.on();
  });

  return {
    onSelectionChange,
    onTransformStart,
    onTransform,
    onTransformEnd,
  };
}

export type UseHandlersType = ReturnType<typeof useHandlers>;
