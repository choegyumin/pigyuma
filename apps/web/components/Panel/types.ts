import { DynamicComponent, DynamicComponentPropsWithoutRef } from '@pigyuma/react-utils';
import React from 'react';

export const DefaultPanelElementType = 'aside';
export type DefaultPanelElementType = typeof DefaultPanelElementType;

export interface PanelCustomProps {
  placement: 'left' | 'right';
}

export interface PanelProps extends DynamicComponentPropsWithoutRef<DefaultPanelElementType, PanelCustomProps> {}
export type PanelRefInstance = React.ElementRef<DefaultPanelElementType>;
export interface PanelComponent extends DynamicComponent<PanelCustomProps, DefaultPanelElementType> {}

export const DefaultPanelGroupElementType = 'div';
export type DefaultPanelGroupElementType = typeof DefaultPanelGroupElementType;

export interface PanelGroupCustomProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  heading?: React.ReactNode;
}

export interface PanelGroupProps extends DynamicComponentPropsWithoutRef<DefaultPanelGroupElementType, PanelGroupCustomProps> {}
export type PanelGroupRefInstance = React.ElementRef<DefaultPanelGroupElementType>;
export interface PanelGroupComponent extends DynamicComponent<PanelGroupCustomProps, DefaultPanelGroupElementType> {}
