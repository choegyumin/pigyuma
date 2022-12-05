import extensions from '@pigyuma/ui/styles/extensions';
import spacing from './spacing.css';

export default (level: number) => {
  return extensions.calc.multiply(spacing.base, level);
};
