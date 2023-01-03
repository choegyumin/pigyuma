import { create, evaluateDependencies, booleanDependencies } from 'mathjs';
import { MathJsConditionDependencies } from './shared/MathJsDependencies';

const MathJs = create(
  {
    ...MathJsConditionDependencies,
    evaluateDependencies,
    booleanDependencies,
  },
  { number: 'Fraction' },
);

export default function evalMathCondition(expression: string): boolean {
  return MathJs.boolean(MathJs.evaluate(expression));
}
