import { DynamicComponent, DynamicComponentPropsWithoutRef } from '@pigyuma/react-utils';
import React from 'react';

export const DefaultToolbarElementType = 'div';
export type DefaultToolbarElementType = typeof DefaultToolbarElementType;

export interface ToolbarCustomProps {}

export interface ToolbarProps extends DynamicComponentPropsWithoutRef<DefaultToolbarElementType, ToolbarCustomProps> {}
export type ToolbarRefInstance = React.ElementRef<DefaultToolbarElementType>;
export interface ToolbarComponent extends DynamicComponent<ToolbarCustomProps, DefaultToolbarElementType> {}
