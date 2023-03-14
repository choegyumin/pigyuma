import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/design-system/primitives/Box';
import { Artboard, ShapeLayer, TextLayer } from '@pigyuma/ui-design-tool';

export type LayerListProps = ComponentPropsWithoutRefByBox<'ul'> & {
  records: Array<Artboard | ShapeLayer | TextLayer>;
  depth?: number;
  hidden?: boolean;
  onOpen?: () => void;
};
export type LayerListRef = ComponentElementRefByBox<'ul'>;

export type LayerListItemProps = ComponentPropsWithoutRefByBox<'li'> & {
  record: Artboard | ShapeLayer | TextLayer;
  depth?: number;
  onGroupOpen?: () => void;
};
export type LayerListItemRef = ComponentElementRefByBox<'li'>;
