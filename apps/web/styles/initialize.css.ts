import { customizeTheme } from '@pigyuma/design-system/config';
import foundations from '@pigyuma/design-system/foundations';
import { globalFontFace } from '@vanilla-extract/css';

import '@pigyuma/design-system/css';

// globalFontFace('Spoqa Han Sans Neo', {
//   fontWeight: 700,
//   src: 'local("Spoqa Han Sans Neo Bold"), local("SpoqaHanSansNeo-Bold"), url("/fonts/SpoqaHanSansNeo-Bold.woff2") format("woff2")',
// });
// globalFontFace('Spoqa Han Sans Neo', {
//   fontWeight: 500,
//   src: 'local("Spoqa Han Sans Neo Medium"), local("SpoqaHanSansNeo-Medium"), url("/fonts/SpoqaHanSansNeo-Medium.woff2") format("woff2")',
// });
globalFontFace('Spoqa Han Sans Neo', {
  fontWeight: 400,
  src: 'local("Spoqa Han Sans Neo Regular"), local("SpoqaHanSansNeo-Regular"), url("/fonts/SpoqaHanSansNeo-Regular.woff2") format("woff2")',
});
// globalFontFace('Spoqa Han Sans Neo', {
//   fontWeight: 300,
//   src: 'local("Spoqa Han Sans Neo Light"), local("SpoqaHanSansNeo-Light"), url("/fonts/SpoqaHanSansNeo-Light.woff2") format("woff2")',
// });
// globalFontFace('Spoqa Han Sans Neo', {
//   fontWeight: 100,
//   src: 'local("Spoqa Han Sans Neo Thin"), local("SpoqaHanSansNeo-Thin"), url("/fonts/SpoqaHanSansNeo-Thin.woff2") format("woff2")',
// });

customizeTheme({
  typography: {
    base: {
      fontFamily: foundations.typography.fontFamily.sansSerif,
    },
    fontFamily: {
      sansSerif: 'Spoqa Han Sans Neo, var(--sans-serif)',
    },
  },
});
