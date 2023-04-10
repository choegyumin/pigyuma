import useDrafts from '@/hooks/useDrafts';
import useHovered from '@/hooks/useHovered';
import useMode from '@/hooks/useMode';
import useStatusMetadata from '@/hooks/useStatusMetadata';
import useUIRecordForInteraction from '@/hooks/useUIRecordForInteraction';
import { UIDesignToolInteractionType, UIDesignToolMode } from '@/types/Status';
import useRenderUtils from './useRenderUtils';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
export default function useHoveringOverlay() {
  const mode = useMode();
  const statusMetadata = useStatusMetadata();
  const hovered = useHovered();
  const drafts = useDrafts();

  const record = useUIRecordForInteraction(hovered);

  const { getRootStyle } = useRenderUtils();

  const isActive =
    record != null &&
    !drafts.has(record?.key) &&
    mode === UIDesignToolMode.select &&
    statusMetadata.interactionType === UIDesignToolInteractionType.idle;

  if (!isActive) {
    return;
  }

  const rootStyle = getRootStyle(record);

  return { rootStyle };
}
