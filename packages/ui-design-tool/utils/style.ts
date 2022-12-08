import { UIRecordStyle, UIRecordStyleVar } from '@/types/Style';

export const getUIRecordStyleValue = (layer: HTMLElement, property: UIRecordStyle) => {
  return layer.style.getPropertyValue(UIRecordStyleVar[property]);
};

export const getUIRecordStyle = (layer: HTMLElement) => {
  return {
    [UIRecordStyle.x]: getUIRecordStyleValue(layer, UIRecordStyle.x),
    [UIRecordStyle.y]: getUIRecordStyleValue(layer, UIRecordStyle.y),
    [UIRecordStyle.width]: getUIRecordStyleValue(layer, UIRecordStyle.width),
    [UIRecordStyle.height]: getUIRecordStyleValue(layer, UIRecordStyle.height),
    [UIRecordStyle.degrees]: getUIRecordStyleValue(layer, UIRecordStyle.degrees),
    [UIRecordStyle.strokeColor]: getUIRecordStyleValue(layer, UIRecordStyle.strokeColor),
    [UIRecordStyle.strokePattern]: getUIRecordStyleValue(layer, UIRecordStyle.strokePattern),
    [UIRecordStyle.strokeWidth]: getUIRecordStyleValue(layer, UIRecordStyle.strokeWidth),
    [UIRecordStyle.background]: getUIRecordStyleValue(layer, UIRecordStyle.background),
    [UIRecordStyle.textColor]: getUIRecordStyleValue(layer, UIRecordStyle.textColor),
    [UIRecordStyle.fontSize]: getUIRecordStyleValue(layer, UIRecordStyle.fontSize),
    [UIRecordStyle.lineHeight]: getUIRecordStyleValue(layer, UIRecordStyle.lineHeight),
    [UIRecordStyle.fontWeight]: getUIRecordStyleValue(layer, UIRecordStyle.fontWeight),
    [UIRecordStyle.letterSpacing]: getUIRecordStyleValue(layer, UIRecordStyle.letterSpacing),
  };
};

export const setUIRecordStyleValue = (layer: HTMLElement, property: UIRecordStyle, value: string | null) => {
  return layer.style.setProperty(UIRecordStyleVar[property], value);
};
