import PrimitiveNumberInput from '@/primitives/NumberInput';
import { InputOnlyHTMLAttributes, InputOnlyHTMLAttributeKeys } from '@pigyuma/react-utility-types';
import { Box } from '@pigyuma/react-utils';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import FieldTrigger from '../FieldTrigger';
import * as styles from './NumberField.css';
import { NumberFieldProps, NumberFieldRef } from './types';

const NumberField = React.forwardRef<NumberFieldRef, NumberFieldProps>((props, ref) => {
  const { autoSelect, className, ...rootProps } = omit(props, InputOnlyHTMLAttributeKeys) as Omit<
    typeof props,
    keyof InputOnlyHTMLAttributes<HTMLInputElement>
  >;

  const inputProps = pick(props, InputOnlyHTMLAttributeKeys) as PickExisting<typeof props, keyof InputOnlyHTMLAttributes<HTMLInputElement>>;

  return (
    <Box as="span" {...rootProps} ref={ref} className={clsx(styles.root, className)}>
      <FieldTrigger>
        <PrimitiveNumberInput {...inputProps} type="number" autoSelect={autoSelect} />
      </FieldTrigger>
    </Box>
  );
});
NumberField.displayName = 'NumberField';

export default NumberField;
