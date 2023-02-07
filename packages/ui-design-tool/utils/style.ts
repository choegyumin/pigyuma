import { UIRecordStyle, UIRecordStyleVarNames } from '@/types/Style';
import { mapValues } from '@pigyuma/utils';

export const getComputedUIRecordStyleValue = (element: HTMLElement, property: UIRecordStyle) => {
  return element.style.getPropertyValue(UIRecordStyleVarNames[property]);
};

export const getComputedUIRecordStyle = (element: HTMLElement) => {
  return mapValues(UIRecordStyle, (value) => getComputedUIRecordStyleValue(element, value));
};
