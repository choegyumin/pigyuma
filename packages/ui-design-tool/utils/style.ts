import { UIRecordStyle, UIRecordStyleVarNames } from '@/types/Style';
import { mapValues } from '@pigyuma/utils';

export const getUIRecordStyleValue = (element: HTMLElement, property: UIRecordStyle) => {
  return element.style.getPropertyValue(UIRecordStyleVarNames[property]);
};

export const getUIRecordStyle = (element: HTMLElement) => {
  return mapValues(UIRecordStyle, (value) => getUIRecordStyleValue(element, value));
};

export const setUIRecordStyleValue = (element: HTMLElement, property: UIRecordStyle, value: string | null) => {
  return element.style.setProperty(UIRecordStyleVarNames[property], value);
};
