import { useEvent, useForkedRef, useValue } from '@pigyuma/react-utils';
import React, { useState } from 'react';
import Box from '../Box';
import { NumberInputProps, NumberInputRef } from './types';

/**
 * @todo NumberField 컴포넌트 고도화
 * - [type=number] 대신 [type=text] 사용
 * - `step`이 `value`, `min`, `max` HTML Attributes 대신, 현재 입력된 값을 기준으로 동작하도록 개선
 */
const NumberInput = React.forwardRef<NumberInputRef, NumberInputProps>((props, ref) => {
  const forkedRef = useForkedRef(ref);

  const defaultValue = props.defaultValue === null ? '' : props.defaultValue ?? '';
  const [value, setValue] = useValue<number | ''>(props.value === null ? '' : props.value, defaultValue);

  const [stepUp, setStepUp] = useState<boolean>(false);
  const step = Number(props.step ?? 1) * (stepUp ? 10 : 1);

  const onChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(event, Number(event.currentTarget.value));
    setValue(Number(event.currentTarget.value));
  });

  const onChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    props.onChangeCapture?.(event, Number(event.currentTarget.value));
  });

  const onFocusCapture = useEvent((event: React.FocusEvent<HTMLInputElement>) => {
    props.onFocusCapture?.(event);
    if (props.autoSelect) {
      const { currentTarget } = event;
      window.requestAnimationFrame(() => {
        currentTarget.select();
      });
    }
  });

  const onKeyDownCapture = useEvent((event: React.KeyboardEvent<HTMLInputElement>) => {
    props.onKeyDownCapture?.(event);
    setStepUp(event.shiftKey);
  });

  const onKeyUpCapture = useEvent((event: React.KeyboardEvent<HTMLInputElement>) => {
    props.onKeyUpCapture?.(event);
    setStepUp(event.shiftKey);
  });

  return (
    <Box
      {...props}
      ref={forkedRef}
      as="input"
      type="number"
      inputMode="decimal"
      spellCheck={false}
      value={value}
      defaultValue={defaultValue}
      step={step}
      onChange={onChange}
      onChangeCapture={onChangeCapture}
      onFocusCapture={onFocusCapture}
      onKeyDownCapture={onKeyDownCapture}
      onKeyUpCapture={onKeyUpCapture}
    />
  );
});
NumberInput.displayName = 'NumberInput';

export default NumberInput;
