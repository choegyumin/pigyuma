import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@/primitives/Box';

export interface ButtonProps extends ComponentPropsWithoutRefByBox<'button'> {}
export type ButtonRef = ComponentElementRefByBox<'button'>;
