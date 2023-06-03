import { UIRecordKey } from '@pigyuma/ui-design-tool/types/Identifier';
import Panel from '../Panel';

export const LayerTypographySectionElementType = 'div';
export type LayerTypographySectionElementType = typeof LayerTypographySectionElementType;

export interface LayerTypographySectionCustomProps {
  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `UIRecordKey[]` 로 타입 변경 */
  selected?: UIRecordKey;
}

export interface LayerTypographySectionProps
  extends React.ComponentPropsWithoutRef<LayerTypographySectionElementType>,
    Omit<React.ComponentPropsWithoutRef<typeof Panel.Group>, 'heading'>,
    LayerTypographySectionCustomProps {}
export type LayerTypographySectionRefInstance = React.ElementRef<LayerTypographySectionElementType>;
