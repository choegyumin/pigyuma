import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import { LayerTypographySectionProps, LayerTypographySectionRef } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useLayerTypographySection(props: LayerTypographySectionProps, ref: React.ForwardedRef<LayerTypographySectionRef>) {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const hasUIRecord = uiRecord != null;

  const isTextLayer = TextLayer.isModel(uiRecord);

  const canEdit = hasUIRecord && isTextLayer;

  const textColor = isTextLayer ? uiRecord.textColor.color : '';
  const content = isTextLayer ? uiRecord.content : '';

  const onTextColorChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    if (!canEdit) {
      return;
    }
    uiController.set<TextLayer>(uiRecord.key, { textColor: { color } });
  });

  const onContentChange = useEvent((event: React.ChangeEvent<HTMLTextAreaElement>, content: string) => {
    if (!canEdit) {
      return;
    }
    uiController.set<TextLayer>(uiRecord.key, { content });
  });

  return { canEdit, textColor, content, onTextColorChange, onContentChange };
}
