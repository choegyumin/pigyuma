import { CanvasArgs } from '@/api/Canvas/model';

export type WorkspaceProps = React.HTMLAttributes<HTMLDivElement> & {
  initialData: CanvasArgs['children'];
};

export type WorkspaceRef = HTMLDivElement;
