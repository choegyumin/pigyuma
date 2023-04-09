import Box from '@/primitives/Box';
import PrimitiveColorPicker from '@/primitives/ColorPicker';
import { InputOnlyHTMLAttributes, InputOnlyHTMLAttributeKeys } from '@pigyuma/react-utility-types';
import { useEvent, useValue } from '@pigyuma/react-utils';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import Color from 'color';
import React from 'react';
import FieldTrigger from '../FieldTrigger';
import * as styles from './ColorPicker.css';
import { ColorPickerProps, ColorPickerRef } from './types';

const ColorPicker = React.forwardRef<ColorPickerRef, ColorPickerProps>((props, ref) => {
  const { className, ...rootProps } = omit(props, InputOnlyHTMLAttributeKeys) as Omit<
    typeof props,
    keyof InputOnlyHTMLAttributes<HTMLInputElement>
  >;

  const { value, defaultValue, onChange, ...pickerProps } = pick(props, InputOnlyHTMLAttributeKeys) as PickExisting<
    typeof props,
    keyof InputOnlyHTMLAttributes<HTMLInputElement>
  >;

  const [color, setColor] = useValue<string>(value, defaultValue, { notifyError: false });

  const onPickerChange = useEvent<NonNullable<typeof onChange>>((event, newColor) => {
    setColor(newColor);
    onChange?.(event, newColor);
  });

  return (
    <Box as="span" {...rootProps} ref={ref} className={clsx(styles.root, className)}>
      <FieldTrigger className={styles.trigger} aria-hidden={true}>
        <button type="button">
          <span className={styles.color} style={{ [styles.varNames.color]: color }} />
          {color === 'transparent' ? color : Color(color).hex()}
        </button>
      </FieldTrigger>
      <PrimitiveColorPicker {...pickerProps} className={styles.picker} onChange={onPickerChange} />
    </Box>
  );
});
ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
