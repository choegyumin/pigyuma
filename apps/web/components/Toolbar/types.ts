import { DynamicComponentByBox, DynamicComponentPropsByBox } from '@pigyuma/ui/patterns/Box';
import React from 'react';

type CustomProps = React.HTMLAttributes<HTMLElement>;

export type ToolbarProps = DynamicComponentPropsByBox<CustomProps>;

export interface ToolbarComponentFunction extends DynamicComponentByBox<CustomProps> {}
