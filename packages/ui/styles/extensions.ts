import calc from './_tools/calc';
import color from './_tools/color';

export default {
  calc,
  color,
} as {
  // Fix module type declarations error
  calc: typeof calc;
  color: typeof color;
};
