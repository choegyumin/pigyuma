import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import { StrokeStylePattern } from '@pigyuma/ui-design-tool/types/Unit';
import { LayerStrokeSectionProps, LayerStrokeSectionRef } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useLayerStrokeSection(props: LayerStrokeSectionProps, ref: React.ForwardedRef<LayerStrokeSectionRef>) {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const hasUIRecord = uiRecord != null;

  const isShapeLayer = ShapeLayer.isModel(uiRecord);

  const canEdit = hasUIRecord && isShapeLayer;

  const strokeColor = isShapeLayer ? uiRecord.stroke.color : '';
  const strokePattern = isShapeLayer ? uiRecord.stroke.pattern : '';
  const strokeWidth = isShapeLayer ? uiRecord.stroke.width : { top: 0, right: 0, bottom: 0, left: 0 };

  const onStrokeColorChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, color: string) => {
    if (!canEdit) {
      return;
    }
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { color } });
  });

  const onStrokePatternChange = useEvent((event: React.ChangeEvent<HTMLSelectElement>, selected: string | number | undefined) => {
    if (!canEdit || selected == null) {
      return;
    }
    const pattern = selected as StrokeStylePattern;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { pattern } });
  });

  const onStrokeTopWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!canEdit) {
      return;
    }
    const top = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { top } } });
  });

  const onStrokeRightWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!canEdit) {
      return;
    }
    const right = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { right } } });
  });

  const onStrokeBottomWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!canEdit) {
      return;
    }
    const bottom = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { bottom } } });
  });

  const onStrokeLeftWidthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!canEdit) {
      return;
    }
    const left = value ?? 0;
    uiController.set<ShapeLayer>(uiRecord.key, { stroke: { width: { left } } });
  });

  return {
    canEdit,
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
