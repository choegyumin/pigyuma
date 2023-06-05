import { TextareaOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import React from 'react';

type Value = string;

export const TextAreaElementType = 'textarea';
export type TextAreaElementType = typeof TextAreaElementType;

export interface TextAreaCustomProps {
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>, value: Value) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLTextAreaElement>, value: Value) => void;
  autoSelect?: boolean;
}

export interface TextAreaProps
  extends Omit<React.ComponentPropsWithoutRef<'span'> & TextareaOnlyHTMLAttributes<HTMLTextAreaElement>, keyof TextAreaCustomProps>,
    TextAreaCustomProps {}
export type TextAreaRefInstance = React.ElementRef<TextAreaElementType>;
