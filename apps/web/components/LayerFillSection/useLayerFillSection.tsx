import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import { LayerFillSectionProps, LayerFillSectionRef } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useLayerFillSection(props: LayerFillSectionProps, ref: React.ForwardedRef<LayerFillSectionRef>) {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const hasUIRecord = uiRecord != null;

  const isArtboard = Artboard.isModel(uiRecord);
  const isShapeLayer = ShapeLayer.isModel(uiRecord);

  const canEdit = hasUIRecord && (isArtboard || isShapeLayer);

  const fillColor = isArtboard ? uiRecord.fill : isShapeLayer ? uiRecord.fill.color : '';

  const onFillColorChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    if (!canEdit) {
      return;
    }
    if (isArtboard) {
      uiController.set<Artboard>(uiRecord.key, { fill: color });
    } else {
      uiController.set<ShapeLayer>(uiRecord.key, { fill: { color } });
    }
  });

  return { canEdit, fillColor, onFillColorChange };
}
