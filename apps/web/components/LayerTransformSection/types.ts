import { UIRecordKey } from '@pigyuma/ui-design-tool/types/Identifier';
import Panel from '../Panel';

export const LayerTransformSectionElementType = 'div';
export type LayerTransformSectionElementType = typeof LayerTransformSectionElementType;

export interface LayerTransformSectionCustomProps {
  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `UIRecordKey[]` 로 타입 변경 */
  selected?: UIRecordKey;
}

export interface LayerTransformSectionProps
  extends React.ComponentPropsWithoutRef<LayerTransformSectionElementType>,
    Omit<React.ComponentPropsWithoutRef<typeof Panel.Group>, 'heading'>,
    LayerTransformSectionCustomProps {}
export type LayerTransformSectionRefInstance = React.ElementRef<LayerTransformSectionElementType>;
