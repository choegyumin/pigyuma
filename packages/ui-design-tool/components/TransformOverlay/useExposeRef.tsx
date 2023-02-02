import { UIRecordKey } from '@/types/Identifier';
import { UIRecordRect, UIRecordRectInit } from '@/types/Shape';
import { setRef, useStableCallback } from '@pigyuma/react-utils';
import { useImperativeHandle } from 'react';
import { UIDesignToolAPI } from '../Workspace/Workspace.context';
import { TransformOverlayProps, TransformOverlayRef } from './types';
import { UseDataType } from './useData';
import { UseUIControllerType } from './useUIController';

export type UseExposeRefDependencys = {
  api: UIDesignToolAPI;
  props: TransformOverlayProps;
  ref: React.ForwardedRef<TransformOverlayRef>;
  data: UseDataType;
  uiController: UseUIControllerType;
};

export default function useExposeRef(deps: UseExposeRefDependencys) {
  const {
    api,
    ref,
    data: { selectedRecordRef },
    uiController: { hideUI, setOverlayShapeStyle, showUI, switchIdleUI, switchSelectedUI, transformLayer },
  } = deps;

  const select = useStableCallback((recordKey: UIRecordKey) => {
    setRef(selectedRecordRef, api.get(recordKey));
    setOverlayShapeStyle(recordKey);
    switchSelectedUI();
    showUI();
  });

  const deselect = useStableCallback(() => {
    setRef(selectedRecordRef, undefined);
    setOverlayShapeStyle('');
    switchIdleUI();
    hideUI();
  });

  const transform = useStableCallback((recordKey: UIRecordKey, rect: UIRecordRect | UIRecordRectInit) => {
    transformLayer(recordKey, rect);
    setOverlayShapeStyle(recordKey);
  });

  useImperativeHandle(ref, () => ({ select, deselect, transform }), [select, deselect, transform]);
}
