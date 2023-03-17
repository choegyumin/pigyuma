import { Artboard } from '@/api/Artboard/model';
import { Layer } from '@/api/Layer/model';
import useItemReference from '@/hooks/useItemReference';
import useUISelector from '@/hooks/useUISelector';
import { UIInteractionElementDataAttributeName, UIInteractionElementDataset, UIRecordKey } from '@/types/Identifier';
import { isUIRecordKey } from '@/utils/model';
import { useEvent, useEventListener } from '@pigyuma/react-utils';
import React, { useReducer, useState } from 'react';
import { AxisGrid } from '../AxisGrid/AxisGrid';
import { PointerEventsPreventer } from '../PointerEventsPreventer/PointerEventsPreventer';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay';
import { TransformOverlay } from '../TransformOverlay/TransformOverlay';
import * as styles from './InteractionController.css';
import { InteractionControllerProps } from './types';

const Status = {
  idle: 'idle',
  selection: 'selection',
  transform: 'transform',
} as const;
type Status = keyof typeof Status;

const TransformMethod = {
  move: 'move',
  resize: 'resize',
  rotate: 'rotate',
} as const;
type TransformMethod = keyof typeof TransformMethod;

type MetaState = {
  status: Status;
  transformMethod: TransformMethod | 'none';
};

const metaInitialState: MetaState = { status: Status.idle, transformMethod: 'none' };

const META_ACTION_TYPE = {
  IDLE: 'IDLE',
  SELECTION: 'SELECTION',
  TRANSFORM: 'TRANSFORM',
} as const;

type MetaAction =
  | { type: typeof META_ACTION_TYPE.IDLE }
  | { type: typeof META_ACTION_TYPE.SELECTION }
  | { type: typeof META_ACTION_TYPE.TRANSFORM; method: TransformMethod };

const metaReducer = (state: MetaState, action: MetaAction): MetaState => {
  switch (action.type) {
    case META_ACTION_TYPE.IDLE:
      return { status: Status.idle, transformMethod: 'none' };
    case META_ACTION_TYPE.SELECTION:
      return { status: Status.selection, transformMethod: 'none' };
    case META_ACTION_TYPE.TRANSFORM:
      return { status: Status.transform, transformMethod: action.method };
    default:
      return state;
  }
};

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export const InteractionController: React.FC<InteractionControllerProps> = React.memo(() => {
  const uiSelectorAPI = useUISelector();

  const getItemReference = useItemReference();

  /**
   * @todo 이 컴포넌트로 UIRecord를 조작하는 이벤트 핸들러 이관 후 UIDesignTool로 상태 이관
   * @see 플로우차트 (XState를 사용하진 않음) {@link https://stately.ai/viz/9dbc258b-c910-46da-a1fc-f94c8cbfa932}
   */
  const [meta, setMeta] = useReducer(metaReducer, metaInitialState);

  const [hovered, setHovered] = useState<UIRecordKey>();
  const [selected, setSelected] = useState<Set<UIRecordKey>>(new Set());

  const onDocumentMouseDown = useEvent((event: MouseEvent) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const handle = event.target.closest<HTMLElement>(`[${UIInteractionElementDataAttributeName.handleType}]`);

    /** @todo 데이터로 판단하는 대신 `fromMouse`처럼 overlay를 반환하는 메서드를 추가해 선택 영역을 클릭하면 true를 지정하도록 변경 (overlay가 바닥을 덮도록 함) */
    const isSelectionGrabbing = isUIRecordKey(hovered);
    const isHandleGrabbing = handle != null;

    const shouldTransform = isSelectionGrabbing || isHandleGrabbing;
    const shouldSelection = !shouldTransform;

    if (shouldSelection) {
      setMeta({ type: META_ACTION_TYPE.SELECTION });
      setSelected(new Set());
      return;
    }

    if (shouldTransform) {
      const handleType = (handle?.dataset[UIInteractionElementDataset.handleType] as TransformMethod | undefined) ?? 'move';
      setMeta({ type: META_ACTION_TYPE.TRANSFORM, method: handleType });
      if (selected.size === 0 && isUIRecordKey(hovered)) {
        setSelected(new Set([hovered]));
      }
      return;
    }

    setSelected(new Set());
  });

  const onDocumentMouseUp = useEvent(() => {
    setMeta({ type: META_ACTION_TYPE.IDLE });
  });

  const onDocumentMouseMove = useEvent(() => {
    console.log({ ...meta, hovered, selected: [...selected] });

    if (meta.status === Status.idle) {
      const target = uiSelectorAPI.fromMouse();
      const recordKey = target != null ? uiSelectorAPI.dataset(target).key : undefined;
      const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;

      const isSelectableRecord = record instanceof Artboard || record instanceof Layer;

      setHovered(isSelectableRecord ? record.key : undefined);
      return;
    }

    // if (meta.status === Status.selection) {}

    // if (meta.status === Status.transform) {}
  });

  useEventListener(document, 'mousedown', onDocumentMouseDown);
  useEventListener(document, 'mousedown', onDocumentMouseDown);
  useEventListener(document, 'mouseup', onDocumentMouseUp);
  useEventListener(document, 'mousemove', onDocumentMouseMove);

  return (
    <div className={styles.root}>
      <AxisGrid />
      <SelectionOverlay />
      <TransformOverlay />
      <PointerEventsPreventer />
    </div>
  );
});
InteractionController.displayName = 'InteractionController';
