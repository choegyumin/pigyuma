import './_app.css';

import type { AppProps } from 'next/app';
import React from 'react';
import AppProvider from '~/components/AppProvider';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
};
App.displayName = 'App';

export default App;
