import { DynamicComponentByBox, DynamicComponentPropsByBox } from '@pigyuma/react-utils';
import React from 'react';

interface PanelCustomProps extends React.HTMLAttributes<HTMLElement> {
  placement: 'left' | 'right';
}

export interface PanelProps extends DynamicComponentPropsByBox<PanelCustomProps> {}

export interface PanelComponentFunction extends DynamicComponentByBox<PanelCustomProps> {}

interface PanelGroupCustomProps extends React.HTMLAttributes<HTMLElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  heading?: React.ReactNode;
}
export interface PanelGroupProps extends DynamicComponentPropsByBox<PanelGroupCustomProps> {}

export interface PanelGroupComponentFunction extends DynamicComponentByBox<PanelGroupCustomProps> {}
