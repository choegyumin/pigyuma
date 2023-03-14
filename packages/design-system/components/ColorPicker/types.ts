import { ComponentElementRefByBox, ComponentPropsWithoutRefByBox } from '@/primitives/Box';
import { ColorPickerProps as PrimitiveColorPickerProps } from '@/primitives/ColorPicker';

export type ColorPickerProps = Omit<ComponentPropsWithoutRefByBox<'span'>, keyof PrimitiveColorPickerProps> & PrimitiveColorPickerProps;
export type ColorPickerRef = ComponentElementRefByBox<'span'>;
