import extensions from '@/styles/extensions';
import spacingTokens from './spacing.css';

export default function spacing(level: number) {
  return extensions.calc.multiply(spacingTokens.base, level);
}
