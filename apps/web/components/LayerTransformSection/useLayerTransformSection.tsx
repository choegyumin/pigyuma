import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import { HeightLengthType, WidthLengthType, XLengthType, YLengthType } from '@pigyuma/ui-design-tool/types/Unit';
import { LayerTransformSectionProps, LayerTransformSectionRefInstance } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useLayerTransformSection(
  props: LayerTransformSectionProps,
  ref: React.ForwardedRef<LayerTransformSectionRefInstance>,
) {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const uiRecordExists = uiRecord != null;

  const artboardSelected = uiRecord instanceof Artboard;
  const shapeLayerSelected = uiRecord instanceof ShapeLayer;
  const textLayerSelected = uiRecord instanceof TextLayer;

  const positionEditable = uiRecordExists;
  /** @todo shapeType 값 대응 후 TextLayer도 편집 가능하도록 수정 */
  const sizeEditable = uiRecordExists && (artboardSelected || shapeLayerSelected);
  const rotateEditable = uiRecordExists && (shapeLayerSelected || textLayerSelected);

  const x = (artboardSelected ? uiRecord.x : uiRecord?.x.length) ?? 0;
  const y = (artboardSelected ? uiRecord.y : uiRecord?.y.length) ?? 0;
  const width = (artboardSelected ? uiRecord.width : uiRecord?.width.length) ?? 0;
  const height = (artboardSelected ? uiRecord.height : uiRecord?.height.length) ?? 0;
  const rotate = (artboardSelected ? 0 : uiRecord?.rotate.degrees) ?? 0;

  const onXLengthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!positionEditable) {
      return;
    }
    const length = value ?? 0;
    if (artboardSelected) {
      uiController.set<Artboard>(uiRecord.key, { x: length });
    } else {
      uiController.set<ShapeLayer | TextLayer>(uiRecord.key, (prev) => {
        const prevLengthType = prev.x.lengthType;
        const lengthType = prevLengthType !== XLengthType.px && prevLengthType !== XLengthType.percent ? XLengthType.px : prevLengthType;
        return { x: { length, lengthType } };
      });
    }
  });

  const onYLengthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!positionEditable) {
      return;
    }
    const length = value ?? 0;
    if (artboardSelected) {
      uiController.set<Artboard>(uiRecord.key, { y: length });
    } else {
      uiController.set<ShapeLayer | TextLayer>(uiRecord.key, (prev) => {
        const prevLengthType = prev.y.lengthType;
        const lengthType = prevLengthType !== YLengthType.px && prevLengthType !== YLengthType.percent ? YLengthType.px : prevLengthType;
        return { y: { length, lengthType } };
      });
    }
  });

  const onWidthLengthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!sizeEditable) {
      return;
    }
    const length = value ?? 1;
    if (artboardSelected) {
      uiController.set<Artboard>(uiRecord.key, { width: length });
    } else {
      uiController.set<ShapeLayer>(uiRecord.key, (prev) => {
        const prevLengthType = prev.width.lengthType;
        const lengthType =
          prevLengthType !== WidthLengthType.px && prevLengthType !== WidthLengthType.percent ? WidthLengthType.px : prevLengthType;
        return { width: { length, lengthType } };
      });
    }
  });

  const onHeightLengthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!sizeEditable) {
      return;
    }
    const length = value ?? 1;
    if (artboardSelected) {
      uiController.set<Artboard>(uiRecord.key, { height: length });
    } else {
      uiController.set<ShapeLayer>(uiRecord.key, (prev) => {
        const prevLengthType = prev.height.lengthType;
        const lengthType =
          prevLengthType !== HeightLengthType.px && prevLengthType !== HeightLengthType.percent ? HeightLengthType.px : prevLengthType;
        return { height: { length, lengthType } };
      });
    }
  });

  const onRotateDegChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!rotateEditable) {
      return;
    }
    const degrees = value ?? 0;
    uiController.set<ShapeLayer | TextLayer>(uiRecord.key, { rotate: { degrees } });
  });

  return {
    positionEditable,
    sizeEditable,
    rotateEditable,
    x,
    y,
    width,
    height,
    rotate,
    onXLengthChange,
    onYLengthChange,
    onWidthLengthChange,
    onHeightLengthChange,
    onRotateDegChange,
  };
}
