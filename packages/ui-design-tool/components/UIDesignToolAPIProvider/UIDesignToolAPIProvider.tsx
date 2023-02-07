import React, { useImperativeHandle } from 'react';
import { useUIDesignToolAPI } from '../Workspace/Workspace.context';
import { UIDesignToolAPIProviderProps, UIDesignToolAPIProviderRef } from './types';

export const UIDesignToolAPIProvider = React.memo(
  React.forwardRef<UIDesignToolAPIProviderRef, UIDesignToolAPIProviderProps>((props, ref) => {
    const uiDesignToolAPI = useUIDesignToolAPI();
    useImperativeHandle(ref, () => uiDesignToolAPI, [uiDesignToolAPI]);
    return null;
  }),
);
UIDesignToolAPIProvider.displayName = 'UIDesignToolAPIProvider';
