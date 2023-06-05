import { ColorPickerProps as PrimitiveColorPickerProps } from '@/primitives/ColorPicker';

export const ColorPickerElementType = 'span';
export type ColorPickerElementType = typeof ColorPickerElementType;

export interface ColorPickerCustomProps {}

export interface ColorPickerProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, keyof PrimitiveColorPickerProps>,
    PrimitiveColorPickerProps,
    ColorPickerCustomProps {}
export type ColorPickerRefInstance = React.ElementRef<ColorPickerElementType>;
