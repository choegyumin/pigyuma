import { Layer } from '@/api/Layer/model';
import { setRef, useEvent } from '@pigyuma/react-utils';
import { WorkspaceInteraction } from '../Workspace/types';
import { useContextForInteraction } from '../Workspace/Workspace.context';
import { UseDataType } from './useData';

export type UseHandlersDependencys = {
  context: ReturnType<typeof useContextForInteraction>;
  data: UseDataType;
};

export default function useHandlers(deps: UseHandlersDependencys) {
  const {
    context,
    data: { isActive, setHoveredRecordKey, clickedTargetRef },
  } = deps;

  const onDocumentMouseMove = useEvent(() => {
    if (!isActive) {
      setHoveredRecordKey(undefined);
    }

    const target = context.fromMouse();
    const record = target != null ? context.get(target) : undefined;

    // Artboard, Layer 모두 선택 가능하지만 Artboard는 스펙 상 API 호출로만 허용
    const isLayer = record instanceof Layer;

    setHoveredRecordKey(isLayer ? record.key : undefined);

    /** @todo Range selection 기능 구현 */
    // context.setInteraction(WorkspaceInteraction.selecting);
    // context.select(records.map(({ key }) => key));
  });

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!isActive) {
      return;
    }

    setRef(clickedTargetRef, event.target);

    /** @todo Range selection 기능 구현 */
    // context.setInteraction(WorkspaceInteraction.selecting);
    // context.select([]);
  });

  const onDocumentMouseUp = useEvent((event: MouseEvent) => {
    const lastClickedTarget = clickedTargetRef.current;
    setRef(clickedTargetRef, null);

    if (!isActive || event.target !== lastClickedTarget) {
      return;
    }

    const target = context.fromMouse();
    const record = target != null ? context.get(target) : undefined;

    // Artboard, Layer 모두 선택 가능하지만 Artboard는 스펙 상 API 호출로만 허용
    const isLayer = record instanceof Layer;

    /** @todo Range selection 기능 구현 */
    const records = isLayer && record != null ? [record] : [];

    context.setInteraction(WorkspaceInteraction.idle);
    context.select(records.map(({ key }) => key));
  });

  return {
    onDocumentMouseMove,
    onDocumentMouseDown,
    onDocumentMouseUp,
  };
}

export type UseHandlersType = ReturnType<typeof useHandlers>;
