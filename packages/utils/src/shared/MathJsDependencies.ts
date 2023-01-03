/** @see {@link https://github.com/josdejong/mathjs/blob/master/docs/expressions/syntax.md} */

import {
  addDependencies,
  unaryPlusDependencies,
  subtractDependencies,
  unaryMinusDependencies,
  multiplyDependencies,
  divideDependencies,
  bitAndDependencies,
  bitNotDependencies,
  bitOrDependencies,
  bitXorDependencies,
  leftShiftDependencies,
  rightArithShiftDependencies,
  rightLogShiftDependencies,
  equalDependencies,
  unequalDependencies,
  smallerDependencies,
  smallerEqDependencies,
  largerDependencies,
  largerEqDependencies,
} from 'mathjs';

export const MathJsCalcDependencies = {
  addDependencies,
  unaryPlusDependencies,
  subtractDependencies,
  unaryMinusDependencies,
  multiplyDependencies,
  divideDependencies,
  bitAndDependencies,
  bitNotDependencies,
  bitOrDependencies,
  bitXorDependencies,
  leftShiftDependencies,
  rightArithShiftDependencies,
  rightLogShiftDependencies,
};

export const MathJsConditionDependencies = {
  ...MathJsCalcDependencies,
  equalDependencies,
  unequalDependencies,
  smallerDependencies,
  smallerEqDependencies,
  largerDependencies,
  largerEqDependencies,
};
