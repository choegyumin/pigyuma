import { TextInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import React from 'react';

type Value = string;

export const TextInputElementType = 'input';
export type TextInputElementType = typeof TextInputElementType;

export interface TextInputCustomProps {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: Value) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, value: Value) => void;
  autoSelect?: boolean;
}

export interface TextInputProps
  extends Omit<React.ComponentPropsWithoutRef<'span'> & TextInputOnlyHTMLAttributes<HTMLInputElement>, keyof TextInputCustomProps>,
    TextInputCustomProps {}
export type TextInputRefInstance = React.ElementRef<TextInputElementType>;
