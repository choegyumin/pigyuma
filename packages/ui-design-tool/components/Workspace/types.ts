import { ArtboardData } from '../Artboard/Artboard.model';
import { ShapeLayerData } from '../ShapeLayer/ShapeLayer.model';
import { TextLayerData } from '../TextLayer/TextLayer.model';

export type WorkspaceProps = React.HTMLAttributes<HTMLDivElement> & {
  data: Array<ArtboardData | ShapeLayerData | TextLayerData>;
};

export type WorkspaceRef = HTMLDivElement;
