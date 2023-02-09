import React, { useImperativeHandle } from 'react';
import { useUIDesignToolAPI } from '../Workspace/Workspace.context';
import { UIDesignToolAPIProviderProps, UIDesignToolAPIProviderRef } from './types';

/** @todo (UIDesignToolAPI 제공 방식 변경 시) 컴포넌트 삭제 */
export const UIDesignToolAPIProvider = React.memo(
  React.forwardRef<UIDesignToolAPIProviderRef, UIDesignToolAPIProviderProps>((props, ref) => {
    const uiDesignToolAPI = useUIDesignToolAPI();
    useImperativeHandle(ref, () => uiDesignToolAPI, [uiDesignToolAPI]);
    return null;
  }),
);
UIDesignToolAPIProvider.displayName = 'UIDesignToolAPIProvider';
