import { ComponentPropsWithoutRefByBox } from '@pigyuma/design-system/primitives/Box';
import Panel from '../Panel';

export type ExplorePanelProps = Omit<ComponentPropsWithoutRefByBox<typeof Panel>, 'role' | 'placement'>;
export type ExplorePanelRef = HTMLDivElement;
