import { create, evaluateDependencies, numberDependencies } from 'mathjs';
import { MathJsCalcDependencies } from './shared/MathJsDependencies';

const MathJs = create(
  {
    ...MathJsCalcDependencies,
    evaluateDependencies,
    numberDependencies,
  },
  { number: 'Fraction' },
);

export default function evalMath(expression: string): number {
  return MathJs.number(MathJs.evaluate(expression));
}
