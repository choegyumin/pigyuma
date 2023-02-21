import React from 'react';
import { UIDesignToolProviderProps } from './types';
import UIDesignToolContextProvider from './UIDesignToolProvider.context';

export const UIDesignToolProvider: React.FC<UIDesignToolProviderProps> = (props) => {
  const { api, children } = props;
  return <UIDesignToolContextProvider api={api}>{children}</UIDesignToolContextProvider>;
};
UIDesignToolProvider.displayName = 'UIDesignToolProvider';
