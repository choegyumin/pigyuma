import { UIRecordType } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef, useEvent } from '@pigyuma/react-utils';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import { SelectionOverlayProps, SelectionOverlayRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseHandlersDependencys = {
  api: UIDesignToolAPI;
  props: SelectionOverlayProps;
  ref: React.ForwardedRef<SelectionOverlayRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useHandlers(deps: UseHandlersDependencys) {
  const {
    api,
    props: { onChange },
    data: { active, hoveredRecordRef, clickedTargetRef },
    uiController: { setOverlayShapeStyle },
  } = deps;

  const onMouseMoveForSelection = useEvent((event: MouseEvent) => {
    const { clientX, clientY } = event;

    const target = api.closest(document.elementFromPoint(clientX, clientY), { type: UIRecordType.layer }) ?? null;
    const record = target != null ? api.get(target) : undefined;
    const recordKey = record?.key;

    if (!isUIRecordKey(recordKey) || recordKey === hoveredRecordRef.current?.key) {
      return;
    }

    if (active) {
      setRef(hoveredRecordRef, record);
      setOverlayShapeStyle(recordKey);
    } else {
      setRef(hoveredRecordRef, undefined);
    }
  });

  const onMouseDownForSelection = useEvent((event: MouseEvent) => {
    if (!active) {
      return;
    }
    setRef(clickedTargetRef, event.target);
  });

  const onMouseUpForSelection = useEvent((event: MouseEvent) => {
    if (!active) {
      return;
    }

    const clickedTarget = clickedTargetRef.current;
    setRef(clickedTargetRef, null);

    if (clickedTarget !== event.target) {
      return;
    }

    const { clientX, clientY } = event;

    const target = api.closest(document.elementFromPoint(clientX, clientY), { type: UIRecordType.layer }) ?? null;
    const record = target != null ? api.get(target) : undefined;

    onChange?.({ target, record });
  });

  return {
    onMouseMoveForSelection,
    onMouseDownForSelection,
    onMouseUpForSelection,
  };
}

export type UseHandlersType = ReturnType<typeof useHandlers>;
