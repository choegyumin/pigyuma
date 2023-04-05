import { DynamicComponentByBox, DynamicComponentPropsByBox } from '@pigyuma/design-system/primitives/Box';
import React from 'react';

interface CustomProps extends React.HTMLAttributes<HTMLElement> {}

export interface ToolbarProps extends DynamicComponentPropsByBox<CustomProps> {}

export interface ToolbarComponentFunction extends DynamicComponentByBox<CustomProps> {}
