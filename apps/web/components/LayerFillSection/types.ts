import { UIRecordKey } from '@pigyuma/ui-design-tool/types/Identifier';
import Panel from '../Panel';

export const LayerFillSectionElementType = 'div';
export type LayerFillSectionElementType = typeof LayerFillSectionElementType;

export interface LayerFillSectionCustomProps {
  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `UIRecordKey[]` 로 타입 변경 */
  selected?: UIRecordKey;
}

export interface LayerFillSectionProps
  extends React.ComponentPropsWithoutRef<LayerFillSectionElementType>,
    Omit<React.ComponentPropsWithoutRef<typeof Panel.Group>, 'heading'>,
    LayerFillSectionCustomProps {}
export type LayerFillSectionRefInstance = React.ElementRef<LayerFillSectionElementType>;
