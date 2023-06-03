import { SelectOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import React from 'react';

type Value = string | number;

export const SelectElementType = 'select';
export type SelectElementType = typeof SelectElementType;

export interface SelectCustomProps {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>, selected: Value | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLSelectElement>, selected: Value | undefined) => void;
}

export interface SelectProps
  extends Omit<React.ComponentPropsWithoutRef<'span'> & SelectOnlyHTMLAttributes<HTMLInputElement>, keyof SelectCustomProps>,
    SelectCustomProps {}
export type SelectRefInstance = React.ElementRef<SelectElementType>;

export const SelectItemElementType = 'option';
export type SelectItemElementType = typeof SelectItemElementType;

export interface SelectItemCustomProps {}

export interface SelectItemProps extends React.ComponentPropsWithoutRef<'option'>, SelectItemCustomProps {}
export type SelectItemRefInstance = React.ElementRef<SelectItemElementType>;
