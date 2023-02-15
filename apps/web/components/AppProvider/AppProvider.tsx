import { UIDesignToolProvider } from '@pigyuma/ui-design-tool';
import { UIDesignTool } from '@pigyuma/ui-design-tool/api/UIDesignTool';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { AppProviderProps } from './types';

const uiDesignTool = new UIDesignTool();

const AppProvider: React.FC<AppProviderProps> = (props) => {
  return (
    <RecoilRoot>
      <UIDesignToolProvider api={uiDesignTool}>{props.children}</UIDesignToolProvider>
    </RecoilRoot>
  );
};
AppProvider.displayName = 'AppProvider';

export default AppProvider;
