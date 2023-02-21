import { ComponentPropsByBox } from '@pigyuma/ui';
import Panel from '../Panel';

export type ExplorePanelProps = Omit<ComponentPropsByBox<typeof Panel>, 'role' | 'placement'>;
export type ExplorePanelRef = HTMLDivElement;
