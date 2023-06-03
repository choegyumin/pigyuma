import { ColorInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import React from 'react';

type Value = string;

export const ColorPickerElementType = 'input';
export type ColorPickerElementType = typeof ColorPickerElementType;

export interface ColorPickerCustomProps {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: Value) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, value: Value) => void;
}

export interface ColorPickerProps
  extends Omit<
      React.ComponentPropsWithoutRef<'span'> & ColorInputOnlyHTMLAttributes<HTMLInputElement>,
      keyof ColorPickerCustomProps | 'type'
    >,
    ColorPickerCustomProps {}
export type ColorPickerRefInstance = React.ElementRef<ColorPickerElementType>;
