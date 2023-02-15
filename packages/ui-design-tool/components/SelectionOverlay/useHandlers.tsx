import { Layer } from '@/api/Layer/model';
import { UIDesignToolStatus } from '@/api/UIDesignTool';
import { useDispatcher, useUIDesignToolAPI } from '@/hooks';
import { isUIRecordKey } from '@/utils/model';
import { setRef, useEvent } from '@pigyuma/react-utils';
import { UseDataType } from './useData';

export type UseHandlersDependencys = {
  api: ReturnType<typeof useUIDesignToolAPI>;
  data: UseDataType;
};

export default function useHandlers(deps: UseHandlersDependencys) {
  const {
    api,
    data: { isActive, setHoveredRecordKey, clickedTargetRef },
  } = deps;

  const { setStatus } = useDispatcher();

  const onDocumentMouseMove = useEvent(() => {
    if (!isActive) {
      setHoveredRecordKey(undefined);
    }

    const target = api.fromMouse();
    const recordKey = target != null ? api.dataset(target).key : undefined;
    const record = isUIRecordKey(recordKey) ? api.get(recordKey) : undefined;

    // Artboard, Layer 모두 선택 가능하지만 Artboard는 스펙 상 API 호출로만 허용
    const isLayer = record instanceof Layer;

    setHoveredRecordKey(isLayer ? record.key : undefined);

    /** @todo Range selection 기능 구현 */
    // setStatus(UIDesignToolStatus.selecting);
    // api.select(records.map(({ key }) => key));
  });

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!isActive) {
      return;
    }

    setRef(clickedTargetRef, event.target);

    /** @todo Range selection 기능 구현 */
    // setStatus(UIDesignToolStatus.selecting);
    // api.select([]);
  });

  const onDocumentMouseUp = useEvent((event: MouseEvent) => {
    const lastClickedTarget = clickedTargetRef.current;
    setRef(clickedTargetRef, null);

    if (!isActive || event.target !== lastClickedTarget) {
      return;
    }

    const target = api.fromMouse();
    const recordKey = target != null ? api.dataset(target).key : undefined;
    const record = isUIRecordKey(recordKey) ? api.get(recordKey) : undefined;

    // Artboard, Layer 모두 선택 가능하지만 Artboard는 스펙 상 API 호출로만 허용
    const isLayer = record instanceof Layer;

    /** @todo Range selection 기능 구현 */
    const records = isLayer && record != null ? [record] : [];

    setStatus(UIDesignToolStatus.idle);
    api.select(records.map(({ key }) => key));
  });

  return {
    onDocumentMouseMove,
    onDocumentMouseDown,
    onDocumentMouseUp,
  };
}

export type UseHandlersType = ReturnType<typeof useHandlers>;
