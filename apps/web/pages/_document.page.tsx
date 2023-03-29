import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

const Document: React.FC = () => {
  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="Content-Language" content="en_US" />
        <meta name="google" content="notranslate" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
Document.displayName = 'Document';

export default Document;
