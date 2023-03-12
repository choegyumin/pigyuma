import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/design-system/primitives';
import { Artboard, ShapeLayer, TextLayer } from '@pigyuma/ui-design-tool';

export type LayerTreeSectionProps = ComponentPropsWithoutRefByBox<'div'>;
export type LayerTreeSectionRef = ComponentElementRefByBox<'div'>;

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
