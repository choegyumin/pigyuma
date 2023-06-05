import {
  RadioGroupElementType as PrimitiveRadioGroupElementType,
  RadioGroupItemProps as PrimitiveRadioGroupItemProps,
  RadioGroupProps as PrimitiveRadioGroupProps,
  RadioGroupRefInstance as PrimitiveRadioGroupRefInstance,
} from '@/primitives/RadioGroup';

export const RadioButtonGroupElementType = PrimitiveRadioGroupElementType;
export type RadioButtonGroupElementType = typeof RadioButtonGroupElementType;

export interface RadioButtonGroupCustomProps {}

export interface RadioButtonGroupProps extends PrimitiveRadioGroupProps, RadioButtonGroupCustomProps {}
export type RadioButtonGroupRefInstance = PrimitiveRadioGroupRefInstance;

export const RadioButtonGroupItemElementType = 'label';
export type RadioButtonGroupItemElementType = typeof RadioButtonGroupItemElementType;

export interface RadioButtonGroupItemCustomProps {}

export interface RadioButtonGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<'label'>, 'for' | keyof PrimitiveRadioGroupItemProps>,
    PrimitiveRadioGroupItemProps,
    RadioButtonGroupItemCustomProps {}
export type RadioButtonGroupItemRefInstance = React.ElementRef<RadioButtonGroupItemElementType>;
