import { createGlobalThemeContract } from '@vanilla-extract/css';

export type Token = string;
export type TokenName = string;

export type TokenNames<T extends AnyObject> = {
  [P in keyof T]: T[P] extends AnyObject ? TokenNames<T[P]> : TokenName;
};

export interface ColorThemeTokens {
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
}

export interface ShadowThemeTokens {
  box: {
    level0: Token;
    level1: Token;
  };
}

export interface SpacingThemeTokens {
  scale: Token;
}

export interface SystemThemeTokens {
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
}

export interface TransitionThemeTokens {
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
}

export interface TypographyThemeTokens {
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
}

export interface GlobalThemeTokens {
  color: ColorThemeTokens;
  shadow: ShadowThemeTokens;
  spacing: SpacingThemeTokens;
  system: SystemThemeTokens;
  transition: TransitionThemeTokens;
  typography: TypographyThemeTokens;
}

export type GlobalThemeVars = ReturnType<typeof createGlobalThemeContract<TokenNames<GlobalThemeTokens>>>;
