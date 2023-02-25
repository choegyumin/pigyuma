import { Layer } from '@/api/Layer/model';
import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { useItemReference, useDispatcher, useUIController, useUIElement } from '@/hooks';
import { UIDesignToolIDAttributeName } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { setRef, useEvent } from '@pigyuma/react-utils';
import { UseDataType } from './useData';

export type UseHandlersDependencys = {
  data: UseDataType;
};

export default function useHandlers(deps: UseHandlersDependencys) {
  const {
    data: { isActive, setHoveredRecordKey, clickedTargetRef },
  } = deps;

  const uiControllerAPI = useUIController();
  const uiElementAPI = useUIElement();

  const getItemReference = useItemReference();

  const { setStatus } = useDispatcher();

  const onDocumentMouseMove = useEvent(() => {
    if (!isActive) {
      setHoveredRecordKey(undefined);
    }

    const target = uiElementAPI.fromMouse();
    const recordKey = target != null ? uiElementAPI.dataset(target).key : undefined;
    const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;

    // Artboard, Layer 모두 선택 가능하지만 Artboard는 스펙 상 API 호출로만 허용
    const isLayer = record instanceof Layer;

    setHoveredRecordKey(isLayer ? record.key : undefined);

    /** @todo Range selection 기능 구현 */
    // setStatus(UIDesignToolStatus.selecting);
    // uiControllerAPI.select(records.map(({ key }) => key));
  });

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!isActive) {
      return;
    }

    setRef(clickedTargetRef, event.target);

    /** @todo Range selection 기능 구현 */
    // setStatus(UIDesignToolStatus.selecting);
    // uiControllerAPI.select([]);
  });

  const onDocumentMouseUp = useEvent((event: MouseEvent) => {
    if (!(event.target instanceof Element && event.target.closest(`[${UIDesignToolIDAttributeName}]`))) {
      return;
    }

    const lastClickedTarget = clickedTargetRef.current;
    setRef(clickedTargetRef, null);

    if (!isActive || event.target !== lastClickedTarget) {
      return;
    }

    const target = uiElementAPI.fromMouse();
    const recordKey = target != null ? uiElementAPI.dataset(target).key : undefined;
    const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;

    // Artboard, Layer 모두 선택 가능하지만 Artboard는 스펙 상 API 호출로만 허용
    const isLayer = record instanceof Layer;

    /** @todo Range selection 기능 구현 */
    const records = isLayer && record != null ? [record] : [];

    setStatus(UIDesignToolStatus.idle);
    uiControllerAPI.select(records.map(({ key }) => key));
  });

  return {
    onDocumentMouseMove,
    onDocumentMouseDown,
    onDocumentMouseUp,
  };
}

export type UseHandlersType = ReturnType<typeof useHandlers>;
