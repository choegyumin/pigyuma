import { DynamicComponentByBox, DynamicComponentPropsByBox } from '@pigyuma/react-utils';
import React from 'react';

interface CustomProps extends React.HTMLAttributes<HTMLElement> {}

export interface ToolbarProps extends DynamicComponentPropsByBox<CustomProps> {}

export interface ToolbarComponentFunction extends DynamicComponentByBox<CustomProps> {}
