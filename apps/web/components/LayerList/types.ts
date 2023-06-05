import { Artboard, ShapeLayer, TextLayer } from '@pigyuma/ui-design-tool';
import React from 'react';

export const LayerListElementType = 'ul';
export type LayerListElementType = typeof LayerListElementType;

export interface LayerListCustomProps {
  records: Array<Artboard | ShapeLayer | TextLayer>;
  depth?: number;
  hidden?: boolean;
  onOpen?: () => void;
}

export interface LayerListProps extends React.ComponentPropsWithoutRef<LayerListElementType>, LayerListCustomProps {}
export type LayerListRefInstance = React.ElementRef<LayerListElementType>;

export const LayerListItemElementType = 'li';
export type LayerListItemElementType = typeof LayerListItemElementType;

export interface LayerListItemCustomProps {
  record: Artboard | ShapeLayer | TextLayer;
  depth?: number;
  onGroupOpen?: () => void;
}

export interface LayerListItemProps extends React.ComponentPropsWithoutRef<LayerListItemElementType>, LayerListItemCustomProps {}
export type LayerListItemRefInstance = React.ElementRef<LayerListItemElementType>;
