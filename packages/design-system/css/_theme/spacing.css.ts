import { createGlobalTheme, createGlobalThemeContract } from '@vanilla-extract/css';
import { SpacingThemeTokens, TokenNames } from './types';

export const spacingScaleNames: { spacing: Pick<TokenNames<SpacingThemeTokens>, 'scale'> } = {
  spacing: {
    scale: 'spacing',
  },
};
export const spacingScaleTokens: { spacing: Pick<SpacingThemeTokens, 'scale'> } = {
  spacing: {
    scale: '4px',
  },
};
export const spacingScaleContract = createGlobalThemeContract(spacingScaleNames);
createGlobalTheme(':root', spacingScaleContract, spacingScaleTokens);
const {
  spacing: { scale },
} = spacingScaleContract;

export default {
  scale,
};
