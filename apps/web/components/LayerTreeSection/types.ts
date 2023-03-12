import { ComponentPropsByBox, ComponentRefByBox } from '@pigyuma/design-system/primitives';
import { Artboard, ShapeLayer, TextLayer } from '@pigyuma/ui-design-tool';

export type LayerTreeSectionProps = ComponentPropsByBox<'div'>;
export type LayerTreeSectionRef = ComponentRefByBox<'div'>;

export type LayerListProps = ComponentPropsByBox<'ul'> & {
  records: Array<Artboard | ShapeLayer | TextLayer>;
  depth?: number;
  hidden?: boolean;
  onOpen?: () => void;
};
export type LayerListRef = ComponentRefByBox<'ul'>;

export type LayerListItemProps = ComponentPropsByBox<'li'> & {
  record: Artboard | ShapeLayer | TextLayer;
  depth?: number;
  onGroupOpen?: () => void;
};
export type LayerListItemRef = ComponentRefByBox<'li'>;
