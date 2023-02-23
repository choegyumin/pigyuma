import { createGlobalTheme, createGlobalThemeContract } from '@vanilla-extract/css';
import { TypographyThemeTokens, TypographyThemeTokenNames } from './types';

export const typographyFontFamilyNames: { typography: Pick<TypographyThemeTokenNames, 'fontFamily'> } = {
  typography: {
    fontFamily: {
      monospace: 'font-monospace',
      sansSerif: 'font-sans-serif',
      serif: 'font-serif',
      systemUI: 'font-system-ui',
    },
  },
};
export const typographyFontFamilyTokens: { typography: Pick<TypographyThemeTokens, 'fontFamily'> } = {
  typography: {
    fontFamily: {
      monospace: 'D2Coding, var(--monospace), monospace',
      sansSerif: 'var(--sans-serif), sans-serif',
      serif: 'var(--serif), serif',
      systemUI: 'var(--system-ui), system-ui',
    },
  },
};
export const typographyFontFamilyContract = createGlobalThemeContract(typographyFontFamilyNames);
createGlobalTheme(':root', typographyFontFamilyContract, typographyFontFamilyTokens);
const {
  typography: { fontFamily },
} = typographyFontFamilyContract;

export const typographyBaseNames: { typography: Pick<TypographyThemeTokenNames, 'base'> } = {
  typography: {
    base: {
      fontFamily: 'base-font-family',
    },
  },
};
export const typographyBaseTokens: { typography: Pick<TypographyThemeTokens, 'base'> } = {
  typography: {
    base: {
      fontFamily: fontFamily.systemUI,
    },
  },
};
export const typographyBaseContract = createGlobalThemeContract(typographyBaseNames);
createGlobalTheme(':root', typographyBaseContract, typographyBaseTokens);
const {
  typography: { base },
} = typographyBaseContract;

export const typographyStylesNames: { typography: Pick<TypographyThemeTokenNames, 'styles'> } = {
  typography: {
    styles: {
      body: {
        letterSpacing: 'body-letter-spacing',
        lineHeight: 'body-line-height',
        fontFamily: 'body-font-family',
        fontSize: 'body-font-size',
        fontVariant: 'body-font-variant',
        fontWeight: 'body-font-weight',
      },
    },
  },
};
export const typographyStylesTokens: { typography: Pick<TypographyThemeTokens, 'styles'> } = {
  typography: {
    styles: {
      body: {
        letterSpacing: '0',
        lineHeight: '1.5',
        fontFamily: base.fontFamily,
        fontSize: '14px',
        fontVariant: 'normal',
        fontWeight: '400',
      },
    },
  },
};
export const typographyStylesContract = createGlobalThemeContract(typographyStylesNames);
createGlobalTheme(':root', typographyStylesContract, typographyStylesTokens);
const {
  typography: { styles },
} = typographyStylesContract;

export default {
  fontFamily,
  base,
  styles,
};
