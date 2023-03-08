import { customizeTheme } from '@pigyuma/design-system/config';
import foundations from '@pigyuma/design-system/foundations';
import { globalFontFace } from '@vanilla-extract/css';

import '@pigyuma/design-system/css';

globalFontFace('Spoqa Han Sans Neo', {
  src: 'local("Spoqa Han Sans Neo Regular"), local("SpoqaHanSansNeo-Regular"), url("/fonts/SpoqaHanSansNeo-Regular.woff2") format("woff2")',
});

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
