import { ColorPickerProps as PrimitiveColorPickerProps } from '@/primitives/ColorPicker';
import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@pigyuma/react-utils';

export interface ColorPickerProps
  extends Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveColorPickerProps>,
    PrimitiveColorPickerProps {}
export type ColorPickerRef = ComponentElementRefByBox<'span'>;
