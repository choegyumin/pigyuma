import { DynamicComponentByBox, DynamicComponentPropsByBox } from '@pigyuma/ui/patterns/Box';
import React from 'react';

type CustomProps = React.HTMLAttributes<HTMLElement> & {
  placement: 'left' | 'right';
};

export type PanelProps = DynamicComponentPropsByBox<CustomProps>;

export interface PanelComponentFunction extends DynamicComponentByBox<CustomProps> {}
