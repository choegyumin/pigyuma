import { Artboard } from '@/models/Artboard/model';
import { Layer } from '@/models/Layer/model';
import { ShapeLayer } from '@/models/ShapeLayer/model';
import useSelected from '@/renderer/hooks/useSelected';
import useUIRecordForInteraction from '@/renderer/hooks/useUIRecordForInteraction';
import useRenderUtils from './useRenderUtils';

export default function useSelectionOverlay() {
  const selected = useSelected();

  const record = useUIRecordForInteraction([...selected][0]);

  const { getRootStyle, getInfoText, getResizeHandleCursorMap, getRotateHandleCursorMap } = useRenderUtils();

  const actived = record != null && selected.size > 0;

  if (!actived) {
    return;
  }

  /** @todo TextLayer resize 기능 지원 후 ShapeLayer를 Layer로 대체 */
  const resizable = actived && (record instanceof ShapeLayer || record instanceof Artboard);
  const rotatable = actived && record instanceof Layer;

  const rootStyle = actived ? getRootStyle(record) : {};
  const infoText = actived ? getInfoText(record) : '';
  const resizeHandleCursorMap = actived ? getResizeHandleCursorMap(record) : {};
  const rotateHandleCursorMap = actived ? getRotateHandleCursorMap(record) : {};

  return { rotatable, resizable, rootStyle, infoText, resizeHandleCursorMap, rotateHandleCursorMap };
}
