import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/react-utils';
import React from 'react';

export interface LayerFieldProps extends ComponentPropsWithoutRefByBox<'div'> {
  label?: React.ReactNode;
}
export type LayerFieldRef = ComponentElementRefByBox<'div'>;
