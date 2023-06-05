import { NumberInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import React from 'react';

type Value = number | null;

export const NumberInputElementType = 'input';
export type NumberInputElementType = typeof NumberInputElementType;

export interface NumberInputCustomProps {
  type?: Extract<React.ComponentPropsWithoutRef<'input'>['type'], 'number' | 'range'>;
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: Value) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, value: Value) => void;
  autoSelect?: boolean;
}

export interface NumberInputProps
  extends Omit<React.ComponentPropsWithoutRef<'span'> & NumberInputOnlyHTMLAttributes<HTMLInputElement>, keyof NumberInputCustomProps>,
    NumberInputCustomProps {}
export type NumberInputRefInstance = React.ElementRef<NumberInputElementType>;
