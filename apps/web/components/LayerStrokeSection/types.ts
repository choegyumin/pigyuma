import { UIRecordKey } from '@pigyuma/ui-design-tool/types/Identifier';
import Panel from '../Panel';

export const LayerStrokeSectionElementType = 'div';
export type LayerStrokeSectionElementType = typeof LayerStrokeSectionElementType;

export interface LayerStrokeSectionCustomProps {
  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `UIRecordKey[]` 로 타입 변경 */
  selected?: UIRecordKey;
}

export interface LayerStrokeSectionProps
  extends React.ComponentPropsWithoutRef<LayerStrokeSectionElementType>,
    Omit<React.ComponentPropsWithoutRef<typeof Panel.Group>, 'heading'>,
    LayerStrokeSectionCustomProps {}
export type LayerStrokeSectionRefInstance = React.ElementRef<LayerStrokeSectionElementType>;
