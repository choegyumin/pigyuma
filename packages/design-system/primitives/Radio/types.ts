import { CheckableInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import React from 'react';

type Value = string | number;

export const RadioElementType = 'input';
export type RadioElementType = typeof RadioElementType;

export interface RadioCustomProps {
  value?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | undefined) => void;
  cancelable?: boolean;
}

export interface RadioProps
  extends Omit<
      React.ComponentPropsWithoutRef<'span'> & CheckableInputOnlyHTMLAttributes<HTMLInputElement>,
      keyof RadioCustomProps | 'type'
    >,
    RadioCustomProps {}
export type RadioRefInstance = React.ElementRef<RadioElementType>;
