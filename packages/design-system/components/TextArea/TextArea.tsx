import PrimitiveTextArea from '@/primitives/TextArea';
import { TextareaOnlyHTMLAttributes, TextareaOnlyHTMLAttributeKeys } from '@pigyuma/react-utility-types';
import { Box } from '@pigyuma/react-utils';
import { pick, omit } from '@pigyuma/utils';
import clsx from 'clsx';
import React from 'react';
import FieldTrigger from '../FieldTrigger';
import * as styles from './TextArea.css';
import { TextAreaElementType, TextAreaProps, TextAreaRefInstance } from './types';

const TextArea = React.forwardRef<TextAreaRefInstance, TextAreaProps>((props, ref) => {
  const { autoSelect, className, ...rootProps } = omit(props, TextareaOnlyHTMLAttributeKeys) as Omit<
    typeof props,
    keyof TextareaOnlyHTMLAttributes<HTMLTextAreaElement>
  >;

  const inputProps = pick(props, TextareaOnlyHTMLAttributeKeys) as PickExisting<
    typeof props,
    keyof TextareaOnlyHTMLAttributes<HTMLTextAreaElement>
  >;

  return (
    <Box as={TextAreaElementType} {...rootProps} ref={ref} className={clsx(styles.root, className)}>
      <FieldTrigger>
        <PrimitiveTextArea {...inputProps} autoSelect={autoSelect} />
      </FieldTrigger>
    </Box>
  );
});
TextArea.displayName = 'TextArea';

export default TextArea;
