import { DynamicComponentByBox, DynamicComponentPropsByBox } from '@pigyuma/design-system/primitives/Box';
import React from 'react';

type CustomProps = React.HTMLAttributes<HTMLElement>;

export type ToolbarProps = DynamicComponentPropsByBox<CustomProps>;

export interface ToolbarComponentFunction extends DynamicComponentByBox<CustomProps> {}
