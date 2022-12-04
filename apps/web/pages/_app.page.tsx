// Style Sheets
import '@pigyuma/ui/styles/foundations';
import '@pigyuma/ui/styles/globals';
import './_app.css';

import AppProvider from 'components/AppProvider';
import type { AppProps } from 'next/app';
import React from 'react';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
};
App.displayName = 'App';

export default App;
