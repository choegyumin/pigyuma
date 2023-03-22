import { createGlobalTheme, createGlobalThemeContract } from '@vanilla-extract/css';
import { TransitionThemeTokens } from './types';

export const transitionDurationNames: { transition: Pick<TransitionThemeTokens, 'duration'> } = {
  transition: {
    duration: {
      fast: 'transition-duration-fast',
      normal: 'transition-duration-normal',
      slow: 'transition-duration-slow',
    },
  },
};
export const transitionDurationTokens: { transition: Pick<TransitionThemeTokens, 'duration'> } = {
  transition: {
    duration: {
      fast: '0.05s',
      normal: '0.1s',
      slow: '0.4s',
    },
  },
};
export const transitionDurationContract = createGlobalThemeContract(transitionDurationNames);
createGlobalTheme(':root', transitionDurationContract, transitionDurationTokens);
const {
  transition: { duration },
} = transitionDurationContract;

export const transitionEasingNames: { transition: Pick<TransitionThemeTokens, 'easing'> } = {
  transition: {
    easing: {
      easeInOut: 'ease-in-out',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
    },
  },
};
export const transitionEasingTokens: { transition: Pick<TransitionThemeTokens, 'easing'> } = {
  transition: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    },
  },
};
export const transitionEasingContract = createGlobalThemeContract(transitionEasingNames);
createGlobalTheme(':root', transitionEasingContract, transitionEasingTokens);
const {
  transition: { easing },
} = transitionEasingContract;

export default {
  duration,
  easing,
};
