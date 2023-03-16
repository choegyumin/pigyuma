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
      body2: {
        letterSpacing: 'body2-letter-spacing',
        lineHeight: 'body2-line-height',
        fontFamily: 'body2-font-family',
        fontSize: 'body2-font-size',
        fontVariant: 'body2-font-variant',
        fontWeight: 'body2-font-weight',
      },
      caption: {
        letterSpacing: 'caption-letter-spacing',
        lineHeight: 'caption-line-height',
        fontFamily: 'caption-font-family',
        fontSize: 'caption-font-size',
        fontVariant: 'caption-font-variant',
        fontWeight: 'caption-font-weight',
      },
    },
  },
};
export const typographyStylesTokens: { typography: Pick<TypographyThemeTokens, 'styles'> } = {
  typography: {
    styles: {
      body: {
        letterSpacing: '0',
        lineHeight: '1.5em',
        fontFamily: base.fontFamily,
        fontSize: '12px',
        fontVariant: 'normal',
        fontWeight: '400',
      },
      body2: {
        letterSpacing: '0',
        lineHeight: '1.5em',
        fontFamily: base.fontFamily,
        fontSize: '11px',
        fontVariant: 'normal',
        fontWeight: '400',
      },
      caption: {
        letterSpacing: '0',
        lineHeight: '1.5em',
        fontFamily: base.fontFamily,
        fontSize: '12px',
        fontVariant: 'normal',
        fontWeight: '700',
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
