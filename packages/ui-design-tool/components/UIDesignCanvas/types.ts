import { CanvasData } from '@/api/Canvas/model';

export type UIDesignCanvasProps = React.HTMLAttributes<HTMLDivElement> & {
  initialData: CanvasData['children'];
};

export type UIDesignCanvasRef = HTMLDivElement;
