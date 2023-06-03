import React from 'react';

export const LayerFieldsetElementType = 'fieldset';
export type LayerFieldsetElementType = typeof LayerFieldsetElementType;

export interface LayerFieldsetCustomProps {}

export interface LayerFieldsetProps extends React.ComponentPropsWithoutRef<LayerFieldsetElementType>, LayerFieldsetCustomProps {}
export type LayerFieldsetRefInstance = React.ElementRef<LayerFieldsetElementType>;
