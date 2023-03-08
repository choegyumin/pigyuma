import { style } from '@vanilla-extract/css';
import * as fns from './boxModel';

export const blind = style(fns.blindFn());
export const inlineBlind = style(fns.inlineBlindFn());
