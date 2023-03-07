import { ComponentPropsByBox } from '@pigyuma/ui/patterns';
import Panel from '../Panel';

export type ExplorePanelProps = Omit<ComponentPropsByBox<typeof Panel>, 'role' | 'placement'>;
export type ExplorePanelRef = HTMLDivElement;
