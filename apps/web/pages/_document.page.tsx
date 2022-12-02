import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

const Document: React.FC = () => {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
Document.displayName = 'Document';

export default Document;
