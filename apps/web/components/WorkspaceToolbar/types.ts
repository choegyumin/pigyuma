import Toolbar, { DefaultToolbarElementType } from '../Toolbar';

export const WorkspaceToolbarElementType = DefaultToolbarElementType;
export type WorkspaceToolbarElementType = typeof WorkspaceToolbarElementType;

export interface WorkspaceToolbarCustomProps {}

export interface WorkspaceToolbarProps
  extends React.ComponentPropsWithoutRef<WorkspaceToolbarElementType>,
    React.ComponentPropsWithoutRef<typeof Toolbar>,
    WorkspaceToolbarCustomProps {}
export type WorkspaceToolbarRefInstance = React.ElementRef<WorkspaceToolbarElementType>;
