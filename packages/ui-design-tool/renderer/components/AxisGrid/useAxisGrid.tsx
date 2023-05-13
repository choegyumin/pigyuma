import useDrafts from '@/renderer/hooks/useDrafts';
import useSelected from '@/renderer/hooks/useSelected';
import useStatusMetadata from '@/renderer/hooks/useStatusMetadata';
import useUIRecordForInteraction from '@/renderer/hooks/useUIRecordForInteraction';
import { UIDesignToolInteractionType } from '@/types/Status';
import useRenderUtils from './useRenderUtils';

export default function useAxisGrid() {
  const statusMetadata = useStatusMetadata();
  const selected = useSelected();
  const drafts = useDrafts();

  const record = useUIRecordForInteraction([...selected][0]);

  const { getRootStyle } = useRenderUtils();

  const actived =
    record != null &&
    selected.size === 1 &&
    !drafts.has(record?.key) &&
    statusMetadata.interactionType === UIDesignToolInteractionType.idle;

  if (!actived) {
    return;
  }

  const rootStyle = getRootStyle(record);

  return { rootStyle };
}
