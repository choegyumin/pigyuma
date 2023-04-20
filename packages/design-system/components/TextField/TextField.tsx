import PrimitiveTextInput from '@/primitives/TextInput';
import { InputOnlyHTMLAttributes, InputOnlyHTMLAttributeKeys } from '@pigyuma/react-utility-types';
import { Box } from '@pigyuma/react-utils';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import FieldTrigger from '../FieldTrigger';
import * as styles from './TextField.css';
import { TextFieldProps, TextFieldRef } from './types';

const TextField = React.forwardRef<TextFieldRef, TextFieldProps>((props, ref) => {
  const { autoSelect, className, ...rootProps } = omit(props, InputOnlyHTMLAttributeKeys) as Omit<
    typeof props,
    keyof InputOnlyHTMLAttributes<HTMLInputElement>
  >;

  const inputProps = pick(props, InputOnlyHTMLAttributeKeys) as PickExisting<typeof props, keyof InputOnlyHTMLAttributes<HTMLInputElement>>;

  return (
    <Box as="span" {...rootProps} ref={ref} className={clsx(styles.root, className)}>
      <FieldTrigger>
        <PrimitiveTextInput {...inputProps} autoSelect={autoSelect} />
      </FieldTrigger>
    </Box>
  );
});
TextField.displayName = 'TextField';

export default TextField;
