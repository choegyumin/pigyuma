import { ComponentPropsByBox } from '@pigyuma/design-system/patterns';
import Panel from '../Panel';

export type ExplorePanelProps = Omit<ComponentPropsByBox<typeof Panel>, 'role' | 'placement'>;
export type ExplorePanelRef = HTMLDivElement;
