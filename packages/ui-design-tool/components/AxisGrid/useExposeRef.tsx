import { UIRecordKey } from '@/types/Identifier';
import { useStableCallback } from '@pigyuma/react-utils';
import { useImperativeHandle } from 'react';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import { AxisGridProps, AxisGridRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseExposeRefDependencys = {
  api: UIDesignToolAPI;
  props: AxisGridProps;
  ref: React.ForwardedRef<AxisGridRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useExposeRef(deps: UseExposeRefDependencys) {
  const {
    ref,
    uiController: { hideUI, setOverlayShapeStyle, showUI },
  } = deps;

  const select = useStableCallback((recordKey: UIRecordKey) => {
    setOverlayShapeStyle(recordKey);
    showUI();
  });

  const deselect = useStableCallback(() => {
    setOverlayShapeStyle('');
    hideUI();
  });

  useImperativeHandle(ref, () => ({ select, deselect }), [select, deselect]);
}
