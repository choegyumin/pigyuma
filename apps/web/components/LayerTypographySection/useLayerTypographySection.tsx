import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import { LayerTypographySectionProps, LayerTypographySectionRefInstance } from './types';

export default function useLayerTypographySection(
  props: LayerTypographySectionProps,
  ref: React.ForwardedRef<LayerTypographySectionRefInstance>,
) {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const uiRecordExists = uiRecord != null;

  const textLayerSelected = uiRecord instanceof TextLayer;

  const editable = uiRecordExists && textLayerSelected;

  const textColor = textLayerSelected ? uiRecord.textColor.color : '';
  const content = textLayerSelected ? uiRecord.content : '';

  const onTextColorChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    if (!editable) {
      return;
    }
    uiController.set<TextLayer>(uiRecord.key, { textColor: { color } });
  });

  const onContentChange = useEvent((event: React.ChangeEvent<HTMLTextAreaElement>, content: string) => {
    if (!editable) {
      return;
    }
    uiController.set<TextLayer>(uiRecord.key, { content });
  });

  return { editable, textColor, content, onTextColorChange, onContentChange };
}
