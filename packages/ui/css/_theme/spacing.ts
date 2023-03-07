import { calc } from '@/extensions';
import spacingTokens from './spacing.css';

export default function spacing(level: number) {
  return calc.multiply(spacingTokens.scale, level);
}
