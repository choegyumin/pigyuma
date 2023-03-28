import { Artboard } from '@/api/Artboard/model';
import { Layer } from '@/api/Layer/model';
import useDispatcher from '@/hooks/useDispatcher';
import useUISelector from '@/hooks/useUISelector';
import { isUIRecordKey } from '@/utils/model';
import { useCallback } from 'react';
import { useItemReference } from '../UIDesignToolProvider/UIDesignToolProvider.context';

export default function useHoverFunctions() {
  const uiSelector = useUISelector();

  const getItemReference = useItemReference();

  const { setHovered } = useDispatcher();

  const hover = useCallback(() => {
    const target = uiSelector.fromMouse();
    const recordKey = target != null ? uiSelector.dataset(target).key : undefined;
    const record = isUIRecordKey(recordKey) ? getItemReference(recordKey) : undefined;
    const isSelectableRecord = record instanceof Artboard || record instanceof Layer;
    return setHovered(isSelectableRecord ? record.key : undefined);
  }, [uiSelector, getItemReference, setHovered]);

  return { hover };
}
