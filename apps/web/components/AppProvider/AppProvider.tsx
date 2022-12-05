import React from 'react';
import { RecoilRoot } from 'recoil';
import { AppProviderProps } from './types';

const AppProvider: React.FC<AppProviderProps> = (props) => {
  return <RecoilRoot>{props.children}</RecoilRoot>;
};
AppProvider.displayName = 'AppProvider';

export default AppProvider;
