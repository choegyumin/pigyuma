export default function toFixedFraction(value: number, fractionDigits?: number) {
  if (fractionDigits != null) {
    return value.toFixed(fractionDigits);
  }

  const [numberString, exponentialString] = value.toString().split('e-');
  const exponential = Number(exponentialString ?? '0');
  const [, decimalString = ''] = numberString.split('.');

  const detectedFractiondigits = decimalString.length + exponential;

  return value.toFixed(detectedFractiondigits);
}
