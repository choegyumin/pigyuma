import UIDesignTool, { UIDesignToolProvider } from '@pigyuma/ui-design-tool';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { AppProviderProps } from './types';

const uiDesignTool = new UIDesignTool();

// For live demo
// eslint-disable-next-line no-console
console.log(uiDesignTool);

const AppProvider: React.FC<AppProviderProps> = (props) => {
  return (
    <RecoilRoot>
      <UIDesignToolProvider {...props} api={uiDesignTool} />
    </RecoilRoot>
  );
};
AppProvider.displayName = 'AppProvider';

export default AppProvider;
