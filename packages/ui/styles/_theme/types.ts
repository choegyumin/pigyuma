import { createGlobalThemeContract } from '@vanilla-extract/css';

export type ColorThemeTokens = {
  accent: {
    primary: string;
  };
  neutral: {
    black: string;
    white: string;
  };
  text: {
    primary: string;
  };
};

export type ShadowThemeTokens = {
  box: {
    level0: string;
    level1: string;
  };
};

export type SpacingThemeTokens = {
  scale: string;
};

export type SystemThemeTokens = {
  base: {
    color: string;
    letterSpacing: string;
    lineHeight: string;
    fontFamily: string;
    fontSize: string;
    fontVariant: string;
    fontWeight: string;
  };
  interaction: {
    focusRingColor: string;
  };
};

export type TypographyThemeTokens = {
  fontFamily: {
    monospace: string;
    sansSerif: string;
    serif: string;
    systemUI: string;
  };
  base: {
    fontFamily: string;
  };
  styles: {
    body: {
      letterSpacing: string;
      lineHeight: string;
      fontFamily: string;
      fontSize: string;
      fontVariant: string;
      fontWeight: string;
    };
  };
};

export type GlobalThemeTokens = {
  color: ColorThemeTokens;
  shadow: ShadowThemeTokens;
  spacing: SpacingThemeTokens;
  system: SystemThemeTokens;
  typography: TypographyThemeTokens;
};

export type GlobalThemeVars = ReturnType<typeof createGlobalThemeContract<GlobalThemeTokens>>;
