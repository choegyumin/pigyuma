import { createGlobalThemeContract } from '@vanilla-extract/css';

type Token = string;
type TokenName = string;

type TokenNames<T extends AnyObject> = {
  [P in keyof T]: T[P] extends AnyObject ? TokenNames<T[P]> : TokenName;
};

export type ColorThemeTokens = {
  accent: {
    primary: Token;
  };
  neutral: {
    black: Token;
    white: Token;
  };
  text: {
    primary: Token;
  };
};
export type ColorThemeTokenNames = TokenNames<ColorThemeTokens>;

export type ShadowThemeTokens = {
  box: {
    level0: Token;
    level1: Token;
  };
};
export type ShadowThemeTokenNames = TokenNames<ShadowThemeTokens>;

export type SpacingThemeTokens = {
  scale: Token;
};
export type SpacingThemeTokenNames = TokenNames<SpacingThemeTokens>;

export type SystemThemeTokens = {
  base: {
    color: Token;
    letterSpacing: Token;
    lineHeight: Token;
    fontFamily: Token;
    fontSize: Token;
    fontVariant: Token;
    fontWeight: Token;
  };
  interaction: {
    focusRingColor: Token;
  };
};
export type SystemThemeTokenNames = TokenNames<SystemThemeTokens>;

export type TransitionThemeTokens = {
  duration: {
    fast: Token;
    normal: Token;
    slow: Token;
  };
  easing: {
    easeInOut: Token;
    easeIn: Token;
    easeOut: Token;
  };
};
export type TransitionThemeTokenNames = TokenNames<TransitionThemeTokens>;

export type TypographyThemeTokens = {
  fontFamily: {
    monospace: Token;
    sansSerif: Token;
    serif: Token;
    systemUI: Token;
  };
  base: {
    fontFamily: Token;
  };
  styles: {
    body: {
      letterSpacing: Token;
      lineHeight: Token;
      fontFamily: Token;
      fontSize: Token;
      fontVariant: Token;
      fontWeight: Token;
    };
    body2: {
      letterSpacing: Token;
      lineHeight: Token;
      fontFamily: Token;
      fontSize: Token;
      fontVariant: Token;
      fontWeight: Token;
    };
    caption: {
      letterSpacing: Token;
      lineHeight: Token;
      fontFamily: Token;
      fontSize: Token;
      fontVariant: Token;
      fontWeight: Token;
    };
  };
};
export type TypographyThemeTokenNames = TokenNames<TypographyThemeTokens>;

export type GlobalThemeTokens = {
  color: ColorThemeTokens;
  shadow: ShadowThemeTokens;
  spacing: SpacingThemeTokens;
  system: SystemThemeTokens;
  transition: TransitionThemeTokens;
  typography: TypographyThemeTokens;
};
export type GlobalThemeTokenNames = TokenNames<GlobalThemeTokens>;

export type GlobalThemeVars = ReturnType<typeof createGlobalThemeContract<GlobalThemeTokens>>;
