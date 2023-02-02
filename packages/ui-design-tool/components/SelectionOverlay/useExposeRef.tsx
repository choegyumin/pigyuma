import { isUIRecordKey } from '@/utils/model';
import { useStableCallback } from '@pigyuma/react-utils';
import { useImperativeHandle } from 'react';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import { SelectionOverlayProps, SelectionOverlayRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseExposeRefDependencys = {
  api: UIDesignToolAPI;
  props: SelectionOverlayProps;
  ref: React.ForwardedRef<SelectionOverlayRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useExposeRef(deps: UseExposeRefDependencys) {
  const {
    ref,
    data: { hoveredRecordRef },
    uiController: { hideUI, setOverlayShapeStyle, showUI },
  } = deps;

  const on = useStableCallback(() => {
    const recordKey = hoveredRecordRef.current?.key;
    if (isUIRecordKey(recordKey)) {
      setOverlayShapeStyle(recordKey);
    }
    showUI();
  });

  const off = useStableCallback(() => {
    hideUI();
  });

  useImperativeHandle(ref, () => ({ on, off }), [on, off]);
}
