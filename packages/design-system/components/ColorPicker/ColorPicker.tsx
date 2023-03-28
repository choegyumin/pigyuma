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
  const rootProps = omit(props, InputOnlyHTMLAttributeKeys) as Omit<typeof props, keyof InputOnlyHTMLAttributes<HTMLInputElement>>;

  const inputProps = pick(props, InputOnlyHTMLAttributeKeys) as PickExisting<typeof props, keyof InputOnlyHTMLAttributes<HTMLInputElement>>;

  const [color, setColor] = useValue<string>(inputProps.value, inputProps.defaultValue, { notifyError: false });

  const onChange = useEvent<NonNullable<typeof inputProps.onChange>>((event, newColor) => {
    setColor(newColor);
    inputProps.onChange?.(event, newColor);
  });

  return (
    <Box as="span" {...rootProps} ref={ref} className={clsx(styles.root, rootProps.className)}>
      <FieldTrigger className={styles.trigger} aria-hidden={true}>
        <button type="button">
          <span className={styles.color} style={{ [styles.varNames.color]: color }} />
          {color === 'transparent' ? color : Color(color).hex()}
        </button>
      </FieldTrigger>
      <PrimitiveColorPicker {...inputProps} className={styles.picker} onChange={onChange} />
    </Box>
  );
});
ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
