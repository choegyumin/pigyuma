import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import { StrokeStylePattern } from '@pigyuma/ui-design-tool/types/Unit';
import { LayerStrokeSectionProps, LayerStrokeSectionRef } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useLayerStrokeSection(props: LayerStrokeSectionProps, ref: React.ForwardedRef<LayerStrokeSectionRef>) {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const uiRecordExists = uiRecord != null;

  const shapeLayerSelected = ShapeLayer.isModel(uiRecord);

  const editable = uiRecordExists && shapeLayerSelected;

  const strokeColor = shapeLayerSelected ? uiRecord.stroke.color : '';
  const strokePattern = shapeLayerSelected ? uiRecord.stroke.pattern : '';
  const strokeWidth = shapeLayerSelected ? uiRecord.stroke.width : { top: 0, right: 0, bottom: 0, left: 0 };

  const onStrokeColorChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    if (!editable) {
      return;
    }
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { color } });
  });

  const onStrokePatternChange = useEvent((event: React.ChangeEvent<HTMLSelectElement>, selected: string | number | undefined) => {
    if (!editable || selected == null) {
      return;
    }
    const pattern = selected as StrokeStylePattern;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { pattern } });
  });

  const onStrokeTopWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!editable) {
      return;
    }
    const top = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { top } } });
  });

  const onStrokeRightWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!editable) {
      return;
    }
    const right = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { right } } });
  });

  const onStrokeBottomWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!editable) {
      return;
    }
    const bottom = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { bottom } } });
  });

  const onStrokeLeftWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!editable) {
      return;
    }
    const left = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { left } } });
  });

  return {
    editable,
    strokeColor,
    strokePattern,
    strokeWidth,
    onStrokeColorChange,
    onStrokePatternChange,
    onStrokeTopWidthChange,
    onStrokeRightWidthChange,
    onStrokeBottomWidthChange,
    onStrokeLeftWidthChange,
  };
}
