import { createGlobalTheme, createGlobalThemeContract } from '@vanilla-extract/css';
import { ShadowThemeTokens, ShadowThemeTokenNames } from './types';

export const shadowBoxNames: { shadow: Pick<ShadowThemeTokenNames, 'box'> } = {
  shadow: {
    box: {
      level0: 'box-shadow-level0',
      level1: 'box-shadow-level1',
    },
  },
};
export const shadowBoxTokens: { shadow: Pick<ShadowThemeTokens, 'box'> } = {
  shadow: {
    box: {
      level0: 'none',
      level1: '0 1px 2px hsl(0 0% 0% / 10%)',
    },
  },
};
export const shadowBoxContract = createGlobalThemeContract(shadowBoxNames);
createGlobalTheme(':root', shadowBoxContract, shadowBoxTokens);
const {
  shadow: { box },
} = shadowBoxContract;

export default {
  box,
};
