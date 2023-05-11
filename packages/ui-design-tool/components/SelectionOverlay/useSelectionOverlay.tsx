import { Artboard } from '@/api/Artboard/model';
import { Layer } from '@/api/Layer/model';
import useSelected from '@/hooks/useSelected';
import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import useRenderUtils from './useRenderUtils';

export default function useSelectionOverlay() {
  const selected = useSelected();

  const record = useUIRecordForInteraction([...selected][0]);

  const { getRootStyle, getInfoText, getResizeHandleCursorMap, getRotateHandleCursorMap } = useRenderUtils();

  const actived = record != null && selected.size > 0;

  if (!actived) {
    return;
  }

  const resizable = actived && (record instanceof Layer || record instanceof Artboard);
  const rotatable = actived && record instanceof Layer;

  const rootStyle = actived ? getRootStyle(record) : {};
  const infoText = actived ? getInfoText(record) : '';
  const resizeHandleCursorMap = actived ? getResizeHandleCursorMap(record) : {};
  const rotateHandleCursorMap = actived ? getRotateHandleCursorMap(record) : {};

  return { rotatable, resizable, rootStyle, infoText, resizeHandleCursorMap, rotateHandleCursorMap };
}
