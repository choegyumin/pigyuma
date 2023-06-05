import Panel from '../Panel';

export const ExplorePanelElementType = 'nav';
export type ExplorePanelElementType = typeof ExplorePanelElementType;

export interface ExplorePanelCustomProps {}

export interface ExplorePanelProps
  extends React.ComponentPropsWithoutRef<ExplorePanelElementType>,
    Omit<React.ComponentPropsWithoutRef<typeof Panel>, 'role' | 'placement'>,
    ExplorePanelCustomProps {}
export type ExplorePanelRefInstance = React.ElementRef<ExplorePanelElementType>;
