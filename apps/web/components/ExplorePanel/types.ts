import { ComponentPropsWithoutRefByBox } from '@pigyuma/react-utils';
import Panel from '../Panel';

export interface ExplorePanelProps extends Omit<ComponentPropsWithoutRefByBox<typeof Panel>, 'role' | 'placement'> {}
export type ExplorePanelRef = HTMLDivElement;
