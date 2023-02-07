import { ArtboardData } from '@/ui-models/Artboard/model';
import { ShapeLayerData } from '@/ui-models/ShapeLayer/model';
import { TextLayerData } from '@/ui-models/TextLayer/model';
import { UIDesignToolAPI } from './Workspace.context';

export const WorkspaceInteraction = {
  unknown: 'unknown',
  idle: 'idle',
  /** Range selection */
  selecting: 'selecting',
  resizing: 'resizing',
  resizingFromCenter: 'resizingFromCenter',
  resizingCorner: 'resizingCorner',
  resizingCornerFromCenter: 'resizingCornerFromCenter',
  rotating: 'rotating',
} as const;
export type WorkspaceInteraction = keyof typeof WorkspaceInteraction;

export const WorkspaceStatus = {
  unknown: 'unknown',
  idle: 'idle',
  /** Range selection */
  selecting: 'selecting',
  resizing: 'resizing',
  rotating: 'rotating',
} as const;
export type WorkspaceStatus = keyof typeof WorkspaceStatus;

export type WorkspaceProps = React.HTMLAttributes<HTMLDivElement> & {
  initialData: Array<ArtboardData | ShapeLayerData | TextLayerData>;
};

export type WorkspaceRef = { api: UIDesignToolAPI; element: HTMLDivElement | null };
