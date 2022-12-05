import { createGlobalTheme, createGlobalThemeContract } from '@vanilla-extract/css';
import colorThemeVars from './color.css';
import { SystemThemeTokens } from './types';
import typographyThemeVars from './typography.css';

export const systemBaseNames: { system: Pick<SystemThemeTokens, 'base'> } = {
  system: {
    base: {
      color: 'default-text-color',
      letterSpacing: 'default-letter-spacing',
      lineHeight: 'default-line-height',
      fontFamily: 'default-font-family',
      fontSize: 'default-font-size',
      fontVariant: 'default-font-variant',
      fontWeight: 'default-font-weight',
    },
  },
};
export const systemBaseTokens: { system: Pick<SystemThemeTokens, 'base'> } = {
  system: {
    base: {
      color: colorThemeVars.text.primary,
      letterSpacing: typographyThemeVars.styles.body.fontFamily,
      lineHeight: typographyThemeVars.styles.body.fontFamily,
      fontFamily: typographyThemeVars.styles.body.fontFamily,
      fontSize: typographyThemeVars.styles.body.fontFamily,
      fontVariant: typographyThemeVars.styles.body.fontFamily,
      fontWeight: typographyThemeVars.styles.body.fontFamily,
    },
  },
};
export const systemBaseContract = createGlobalThemeContract(systemBaseNames);
const {
  system: { base },
} = systemBaseContract;
createGlobalTheme(':root', systemBaseContract, systemBaseTokens);

export const systemInteractionNames: { system: Pick<SystemThemeTokens, 'interaction'> } = {
  system: {
    interaction: {
      focusRingColor: 'focus-ring-color',
    },
  },
};
export const systemInteractionTokens: { system: Pick<SystemThemeTokens, 'interaction'> } = {
  system: {
    interaction: {
      focusRingColor: colorThemeVars.accent.primary,
    },
  },
};
export const systemInteractionContract = createGlobalThemeContract(systemInteractionNames);
createGlobalTheme(':root', systemInteractionContract, systemInteractionTokens);
const {
  system: { interaction },
} = systemInteractionContract;

export default {
  base,
  interaction,
};
