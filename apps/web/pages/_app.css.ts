import { customizeTheme } from '@pigyuma/ui/styles/config';
import foundations from '@pigyuma/ui/styles/foundations';
import { globalFontFace } from '@vanilla-extract/css';

globalFontFace('Spoqa Han Sans Neo', {
  src: 'local("Spoqa Han Sans Neo Regular"), local("SpoqaHanSansNeo-Regular"), url("/fonts/SpoqaHanSansNeo-Regular.woff2") format("woff2")',
});

customizeTheme({
  color: {
    accent: {
      primary: 'green',
    },
  },
  typography: {
    base: {
      fontFamily: foundations.typography.fontFamily.sansSerif,
    },
    fontFamily: {
      sansSerif: 'Spoqa Han Sans Neo, sans-serif',
    },
  },
});
