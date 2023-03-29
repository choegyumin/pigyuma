import './_app.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import AppProvider from '~/components/AppProvider';

const siteName = 'Pigyuma';
const description = 'UI Design Tool making project. 🐷';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <Head>
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="mobile-web-app-capable" content="yes" />
        <title>{siteName}</title>
        <meta name="description" content={description} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={siteName} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={siteName} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:card" content="summary" />
      </Head>
      <Component {...pageProps} />
    </AppProvider>
  );
};
App.displayName = 'App';

export default App;
