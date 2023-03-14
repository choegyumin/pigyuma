import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@/primitives/Box';
import { PRadioGroupItemProps, PRadioGroupProps, PRadioGroupRef } from '@/primitives/RadioGroup';

export type RadioButtonGroupProps = PRadioGroupProps;
export type RadioButtonGroupRef = PRadioGroupRef;

export type RadioButtonGroupItemProps = Omit<ComponentPropsWithoutRefByBox<'label'>, 'for' | keyof PRadioGroupItemProps> &
  PRadioGroupItemProps;
export type RadioButtonGroupItemRef = ComponentElementRefByBox<'label'>;
