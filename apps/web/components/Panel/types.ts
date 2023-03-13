import { DynamicComponentByBox, DynamicComponentPropsByBox } from '@pigyuma/design-system/primitives/Box';
import React from 'react';

type CustomProps = React.HTMLAttributes<HTMLElement> & {
  placement: 'left' | 'right';
};

export type PanelProps = DynamicComponentPropsByBox<CustomProps>;

export interface PanelComponentFunction extends DynamicComponentByBox<CustomProps> {}
