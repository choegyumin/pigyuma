import React from 'react';

export const LayerFieldElementType = 'div';
export type LayerFieldElementType = typeof LayerFieldElementType;

export interface LayerFieldCustomProps {
  label?: React.ReactNode;
}

export interface LayerFieldProps extends React.ComponentPropsWithoutRef<LayerFieldElementType>, LayerFieldCustomProps {}
export type LayerFieldRefInstance = React.ElementRef<LayerFieldElementType>;
