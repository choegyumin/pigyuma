import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/design-system/primitives/Box';
import { Artboard, ShapeLayer, TextLayer } from '@pigyuma/ui-design-tool';

export interface LayerListProps extends ComponentPropsWithoutRefByBox<'ul'> {
  records: Array<Artboard | ShapeLayer | TextLayer>;
  depth?: number;
  hidden?: boolean;
  onOpen?: () => void;
}
export type LayerListRef = ComponentElementRefByBox<'ul'>;

export interface LayerListItemProps extends ComponentPropsWithoutRefByBox<'li'> {
  record: Artboard | ShapeLayer | TextLayer;
  depth?: number;
  onGroupOpen?: () => void;
}
export type LayerListItemRef = ComponentElementRefByBox<'li'>;
