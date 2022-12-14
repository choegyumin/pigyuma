import { ArtboardData } from '../Artboard/Artboard.model';
import { ShapeLayerData } from '../ShapeLayer/ShapeLayer.model';
import { TextLayerData } from '../TextLayer/TextLayer.model';
import { WorkspaceContextValue } from './Workspace.context';

export type WorkspaceProps = React.HTMLAttributes<HTMLDivElement> & {
  initialData: Array<ArtboardData | ShapeLayerData | TextLayerData>;
};

export type WorkspaceRef = Pick<WorkspaceContextValue, 'records' | 'append' | 'prepend' | 'insert' | 'set' | 'remove'> & {
  element: HTMLDivElement | null;
};
