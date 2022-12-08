import dynamic from 'next/dynamic';
import React from 'react';
import { NoSSRProps } from './types';

const RawNoSSR: React.FC<NoSSRProps> = ({ children }) => {
  return <>{children}</>;
};
const NoSSR = dynamic(() => Promise.resolve(RawNoSSR), { ssr: false });
NoSSR.displayName = 'NoSSR';

export default NoSSR;
