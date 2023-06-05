import React from 'react';

export const LayerTreeSectionElementType = 'div';
export type LayerTreeSectionElementType = typeof LayerTreeSectionElementType;

export interface LayerTreeSectionCustomProps {}

export interface LayerTreeSectionProps extends React.ComponentPropsWithoutRef<LayerTreeSectionElementType>, LayerTreeSectionCustomProps {}
export type LayerTreeSectionRefInstance = React.ElementRef<LayerTreeSectionElementType>;
