import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@/primitives/Box';
import { ColorPickerProps as PrimitiveColorPickerProps } from '@/primitives/ColorPicker';

export interface ColorPickerProps
  extends Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveColorPickerProps>,
    PrimitiveColorPickerProps {}
export type ColorPickerRef = ComponentElementRefByBox<'span'>;
