import NumberField from '@pigyuma/design-system/components/NumberField';
import mixins from '@pigyuma/design-system/mixins';
import { useEvent } from '@pigyuma/react-utils';
import { Artboard, ShapeLayer, TextLayer, useUIController, useUIRecord } from '@pigyuma/ui-design-tool';
import { HeightLengthType, WidthLengthType, XLengthType, YLengthType } from '@pigyuma/ui-design-tool/types/Unit';
import clsx from 'clsx';
import React from 'react';
import LayerField from '../LayerField';
import LayerFieldset from '../LayerFieldset';
import Panel from '../Panel';
import * as styles from './LayerTransformSection.css';
import { LayerTransformSectionProps, LayerTransformSectionRef } from './types';

const LayerTransformSection = React.forwardRef<LayerTransformSectionRef, LayerTransformSectionProps>((props, ref) => {
  const { selected: selectedRecordKey } = props;

  const uiController = useUIController();

  const uiRecord = useUIRecord<Artboard | ShapeLayer | TextLayer>(selectedRecordKey);
  const hasUIRecord = uiRecord != null;

  const isArtboard = Artboard.isModel(uiRecord);
  const isShapeLayer = ShapeLayer.isModel(uiRecord);
  const isTextLayer = TextLayer.isModel(uiRecord);

  const canEditPosition = hasUIRecord;
  /** @todo shapeType 값 대응 후 TextLayer도 편집 가능하도록 수정 */
  const canEditSize = hasUIRecord && (isArtboard || isShapeLayer);
  const canEditRotate = hasUIRecord && (isShapeLayer || isTextLayer);

  const x = (isArtboard ? uiRecord.x : uiRecord?.x.length) ?? 0;
  const y = (isArtboard ? uiRecord.y : uiRecord?.y.length) ?? 0;
  const width = (isArtboard ? uiRecord.width : uiRecord?.width.length) ?? 0;
  const height = (isArtboard ? uiRecord.height : uiRecord?.height.length) ?? 0;
  const rotate = (isArtboard ? 0 : uiRecord?.rotate.degrees) ?? 0;

  const onXLengthChange = useEvent((event: React.ChangeEvent<HTMLInputElement>, value: number | null) => {
    if (!canEditPosition) {
      return;
    }
    const length = value ?? 0;
    if (isArtboard) {
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
    if (!canEditPosition) {
      return;
    }
    const length = value ?? 0;
    if (isArtboard) {
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
    if (!canEditSize) {
      return;
    }
    const length = value ?? 0;
    if (isArtboard) {
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
    if (!canEditSize) {
      return;
    }
    const length = value ?? 0;
    if (isArtboard) {
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
    if (!canEditRotate) {
      return;
    }
    const degrees = value ?? 0;
    uiController.set<ShapeLayer | TextLayer>(uiRecord.key, { rotate: { degrees } });
  });

  return (
    <Panel.Group as="div" {...props} ref={ref} className={clsx(styles.root, props.className)}>
      <h2 className={mixins.blind}>Transform</h2>
      <LayerFieldset>
        <LayerField label="X">
          <NumberField autoSelect={true} value={x} onChange={onXLengthChange} disabled={!canEditPosition} />
        </LayerField>
        <LayerField label="Y">
          <NumberField autoSelect={true} value={y} onChange={onYLengthChange} disabled={!canEditPosition} />
        </LayerField>
        <LayerField label="Width">
          <NumberField autoSelect={true} min={0} value={width} onChange={onWidthLengthChange} disabled={!canEditSize} />
        </LayerField>
        <LayerField label="Height">
          <NumberField autoSelect={true} min={0} value={height} onChange={onHeightLengthChange} disabled={!canEditSize} />
        </LayerField>
        <LayerField label="Rotate">
          <NumberField autoSelect={true} value={rotate} onChange={onRotateDegChange} disabled={!canEditRotate} />
        </LayerField>
      </LayerFieldset>
    </Panel.Group>
  );
});
LayerTransformSection.displayName = 'LayerTransformSection';

export default LayerTransformSection;
