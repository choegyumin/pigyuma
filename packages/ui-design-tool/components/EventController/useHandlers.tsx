import { useEvent } from '@pigyuma/react-utils';
import { TransformOverlayResizeEvent, TransformOverlayRotateEvent } from '../TransformOverlay/types';
import { EventControllerProps, EventControllerRef } from './types';
import { UseDataType } from './useData';

export type UseHandlersDependencys = {
  props: EventControllerProps;
  ref: React.ForwardedRef<EventControllerRef>;
  data: UseDataType;
};

export default function useHandlers(deps: UseHandlersDependencys) {
  const {
    data: { axisGridRef, clickedTargetRef, transformOverlayRef, hoveringOverlayRef },
  } = deps;

  const onMouseDownForSelection = useEvent((event: MouseEvent) => {
    clickedTargetRef.current = event.target;
  });

  const onMouseUpForSelection = useEvent((event: MouseEvent) => {
    /**
     * @todo MouseUp이 transform handle에서 발생하지 않도록 수정 (handle에 pointer-events: none; 적용, 또는 투명한 position: fixed; 엘리먼트로 덮기)
     */
    if (clickedTargetRef.current !== event.target) {
      return;
    }
    const { clientX, clientY } = event;
    const layer =
      document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>('[data-ui-name="shape-layer"], [data-ui-name="text-layer"]') ??
      null;

    if (layer) {
      axisGridRef.current?.select(layer);
      transformOverlayRef.current?.select(layer);
    } else {
      axisGridRef.current?.deselect();
      transformOverlayRef.current?.deselect();
    }
  });

  const onTransformStart = useEvent(() => {
    axisGridRef.current?.deselect();
    hoveringOverlayRef.current?.off();
  });

  const onTransformEnd = useEvent(() => {
    hoveringOverlayRef.current?.on();
  });

  const onResizeEnd = useEvent(({ target, x, y, width, height }: TransformOverlayResizeEvent) => {
    if (target != null) {
      transformOverlayRef.current?.transform(target, { x, y, width, height });
      axisGridRef.current?.select(target);
    }
  });

  const onRotateEnd = useEvent(({ target, degrees }: TransformOverlayRotateEvent) => {
    if (target != null) {
      transformOverlayRef.current?.transform(target, { degrees });
      axisGridRef.current?.select(target);
    }
  });

  return {
    onMouseDownForSelection,
    onMouseUpForSelection,
    onTransformStart,
    onTransformEnd,
    onResizeEnd,
    onRotateEnd,
  };
}

export type UseHandlersType = ReturnType<typeof useHandlers>;
