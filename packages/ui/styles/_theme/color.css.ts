import { createGlobalTheme, createGlobalThemeContract } from '@vanilla-extract/css';
import { ColorThemeTokens } from './types';

export const colorAccentNames: { color: Pick<ColorThemeTokens, 'accent'> } = {
  color: {
    accent: {
      primary: 'color-primary',
    },
  },
};
export const colorAccentTokens: { color: Pick<ColorThemeTokens, 'accent'> } = {
  color: {
    accent: {
      primary: 'hsl(215 92% 58%)',
    },
  },
};
export const colorAccentContract = createGlobalThemeContract(colorAccentNames);
createGlobalTheme(':root', colorAccentContract, colorAccentTokens);
const {
  color: { accent },
} = colorAccentContract;

export const colorNeutralNames: { color: Pick<ColorThemeTokens, 'neutral'> } = {
  color: {
    neutral: {
      black: 'color-black',
      white: 'color-white',
    },
  },
};
export const colorNeutralTokens: { color: Pick<ColorThemeTokens, 'neutral'> } = {
  color: {
    neutral: {
      black: 'hsl(0 0% 0%)',
      white: 'hsl(0 0% 100%)',
    },
  },
};
export const colorNeutralContract = createGlobalThemeContract(colorNeutralNames);
createGlobalTheme(':root', colorNeutralContract, colorNeutralTokens);
const {
  color: { neutral },
} = colorNeutralContract;

export const colorTextNames: { color: Pick<ColorThemeTokens, 'text'> } = {
  color: {
    text: {
      primary: 'color-text-primary',
    },
  },
};
export const colorTextTokens: { color: Pick<ColorThemeTokens, 'text'> } = {
  color: {
    text: {
      primary: neutral.black,
    },
  },
};
export const colorTextContract = createGlobalThemeContract(colorTextNames);
createGlobalTheme(':root', colorTextContract, colorTextTokens);
const {
  color: { text },
} = colorTextContract;

export default {
  accent,
  neutral,
  text,
};
