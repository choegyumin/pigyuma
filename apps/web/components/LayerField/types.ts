import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/design-system/primitives/Box';
import React from 'react';

export type LayerFieldProps = ComponentPropsWithoutRefByBox<'div'> & {
  label?: React.ReactNode;
};
export type LayerFieldRef = ComponentElementRefByBox<'div'>;
