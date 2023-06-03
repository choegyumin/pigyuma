import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import { LayerFillSectionProps, LayerFillSectionRefInstance } from './types';

export default function useLayerFillSection(props: LayerFillSectionProps, ref: React.ForwardedRef<LayerFillSectionRefInstance>) {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const uiRecordExists = uiRecord != null;

  const artboardSelected = uiRecord instanceof Artboard;
  const shapeLayerSelected = uiRecord instanceof ShapeLayer;

  const editable = uiRecordExists && (artboardSelected || shapeLayerSelected);

  const fillColor = artboardSelected ? uiRecord.fill : shapeLayerSelected ? uiRecord.fill.color : '';

  const onFillColorChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    if (!editable) {
      return;
    }
    if (artboardSelected) {
      uiController.set<Artboard>(uiRecord.key, { fill: color });
    } else {
      uiController.set<ShapeLayer>(uiRecord.key, { fill: { color } });
    }
  });

  return { editable, fillColor, onFillColorChange };
}
