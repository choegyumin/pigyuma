import { calc } from '@pigyuma/css-utils';
import { nonNullable } from '@pigyuma/utils';
import spacingTokens from './spacing.css';

function spacing(level: number): string;
function spacing(blockOrStart: number, inlineOrEnd: number): string;
function spacing(top: number, right: number, bottom?: number, left?: number): string;
function spacing(top: number, right?: number, bottom?: number, left?: number): string {
  return [
    calc.multiply(spacingTokens.scale, top),
    right != null ? calc.multiply(spacingTokens.scale, right) : undefined,
    bottom != null ? calc.multiply(spacingTokens.scale, bottom) : undefined,
    left != null ? calc.multiply(spacingTokens.scale, left) : undefined,
  ]
    .filter(nonNullable)
    .join(' ');
}

export default spacing;
