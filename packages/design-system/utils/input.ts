export const convertInputSelectedValue = (element: HTMLInputElement | HTMLOptionElement): string | number | undefined => {
  const { value: valueString } = element;
  const { value: valueJSON = '', valueType = 'undefined' } = element.dataset;
  if (valueType === 'undefined') {
    return undefined;
  }
  // for NaN, Infinity...
  if (valueType === 'number') {
    return Number(valueString);
  }
  return JSON.parse(valueJSON);
};
