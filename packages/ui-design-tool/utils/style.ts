import { UIRecordStyle, UIRecordStyleVarNames } from '@/types/Style';
import { mapValues } from '@pigyuma/utils';

export const getUIRecordStyleValue = (layer: HTMLElement, property: UIRecordStyle) => {
  return layer.style.getPropertyValue(UIRecordStyleVarNames[property]);
};

export const getUIRecordStyle = (layer: HTMLElement) => {
  return mapValues(UIRecordStyle, (value) => getUIRecordStyleValue(layer, value));
};

export const setUIRecordStyleValue = (layer: HTMLElement, property: UIRecordStyle, value: string | null) => {
  return layer.style.setProperty(UIRecordStyleVarNames[property], value);
};
