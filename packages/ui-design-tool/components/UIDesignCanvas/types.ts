import { CanvasArgs } from '@/api/Canvas/model';

export type UIDesignCanvasProps = React.HTMLAttributes<HTMLDivElement> & {
  initialData: CanvasArgs['children'];
};

export type UIDesignCanvasRef = HTMLDivElement;
