import { Artboard } from '@/api/Artboard/model';
import { Layer } from '@/api/Layer/model';
import useSelected from '@/hooks/useSelected';
import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import useRenderUtils from './useRenderUtils';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export default function useSelectionOverlay() {
  const selected = useSelected();

  const record = useUIRecordForInteraction([...selected][0]);

  const { getRootStyle, getInfoText, getResizeHandleCursorMap, getRotateHandleCursorMap } = useRenderUtils();

  const isActive = record != null && selected.size > 0;

  if (!isActive) {
    return;
  }

  const isResizable = isActive && (record instanceof Layer || record instanceof Artboard);
  const isRotatable = isActive && record instanceof Layer;

  const rootStyle = isActive ? getRootStyle(record) : {};
  const infoText = isActive ? getInfoText(record) : '';
  const resizeHandleCursorMap = isActive ? getResizeHandleCursorMap(record) : {};
  const rotateHandleCursorMap = isActive ? getRotateHandleCursorMap(record) : {};

  return { isRotatable, isResizable, rootStyle, infoText, resizeHandleCursorMap, rotateHandleCursorMap };
}
