import Box from '@/primitives/Box';
import PrimitiveTextArea from '@/primitives/TextArea';
import { TextareaOnlyHTMLAttributes, TextareaOnlyHTMLAttributeKeys } from '@pigyuma/react-utility-types';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import FieldTrigger from '../FieldTrigger';
import * as styles from './TextArea.css';
import { TextAreaProps, TextAreaRef } from './types';

const TextArea = React.forwardRef<TextAreaRef, TextAreaProps>((props, ref) => {
  const { autoSelect, ...rootProps } = omit(props, TextareaOnlyHTMLAttributeKeys) as Omit<
    typeof props,
    keyof TextareaOnlyHTMLAttributes<HTMLTextAreaElement>
  >;

  const inputProps = pick(props, TextareaOnlyHTMLAttributeKeys) as PickExisting<
    typeof props,
    keyof TextareaOnlyHTMLAttributes<HTMLTextAreaElement>
  >;

  return (
    <Box as="span" {...rootProps} ref={ref} className={clsx(styles.root, rootProps.className)}>
      <FieldTrigger>
        <PrimitiveTextArea {...inputProps} autoSelect={autoSelect} />
      </FieldTrigger>
    </Box>
  );
});
TextArea.displayName = 'TextArea';

export default TextArea;
