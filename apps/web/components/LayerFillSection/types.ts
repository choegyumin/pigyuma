import { ComponentPropsWithoutRefByBox } from '@pigyuma/design-system/primitives/Box';
import { UIRecordKey } from '@pigyuma/ui-design-tool/types/Identifier';
import Panel from '../Panel';

export interface LayerFillSectionProps extends Omit<ComponentPropsWithoutRefByBox<typeof Panel.Group>, 'heading'> {
  /** @todo 여러 레이어를 묶어서 transform 할 수 있게 되면 `UIRecordKey[]` 로 타입 변경 */
  selected?: UIRecordKey;
}
export type LayerFillSectionRef = HTMLDivElement;
