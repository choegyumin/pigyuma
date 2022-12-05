import { createGlobalTheme, createGlobalThemeContract } from '@vanilla-extract/css';
import { SpacingThemeTokens } from './types';

export const spacingBaseNames: { spacing: Pick<SpacingThemeTokens, 'base'> } = {
  spacing: {
    base: 'spacing',
  },
};
export const spacingBaseTokens: { spacing: Pick<SpacingThemeTokens, 'base'> } = {
  spacing: {
    base: '4px',
  },
};
export const spacingBaseContract = createGlobalThemeContract(spacingBaseNames);
createGlobalTheme(':root', spacingBaseContract, spacingBaseTokens);
const {
  spacing: { base },
} = spacingBaseContract;

export default {
  base,
};
