import { DynamicComponentByBox, DynamicComponentPropsByBox } from '@pigyuma/design-system/primitives/Box';
import React from 'react';

type PanelCustomProps = React.HTMLAttributes<HTMLElement> & {
  placement: 'left' | 'right';
};

export type PanelProps = DynamicComponentPropsByBox<PanelCustomProps>;

export interface PanelComponentFunction extends DynamicComponentByBox<PanelCustomProps> {}

type PanelGroupCustomProps = React.HTMLAttributes<HTMLElement> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  heading?: React.ReactNode;
};
export type PanelGroupProps = DynamicComponentPropsByBox<PanelGroupCustomProps>;

export interface PanelGroupComponentFunction extends DynamicComponentByBox<PanelGroupCustomProps> {}
