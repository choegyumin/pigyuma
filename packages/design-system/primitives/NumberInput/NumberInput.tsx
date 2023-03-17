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
  const { autoSelect, ...restProps } = props;
  const forkedRef = useForkedRef(ref);

  const defaultValue = restProps.defaultValue === null ? '' : restProps.defaultValue ?? '';
  const [value, setValue] = useValue<number | ''>(restProps.value === null ? '' : restProps.value, defaultValue);

  const [stepUp, setStepUp] = useState<boolean>(false);
  const step = Number(restProps.step ?? 1) * (stepUp ? 10 : 1);

  const onChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    restProps.onChange?.(event, Number(event.currentTarget.value));
    setValue(Number(event.currentTarget.value));
  });

  const onChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    restProps.onChangeCapture?.(event, Number(event.currentTarget.value));
  });

  const onFocusCapture = useEvent((event: React.FocusEvent<HTMLInputElement>) => {
    restProps.onFocusCapture?.(event);
    if (autoSelect) {
      const { currentTarget } = event;
      window.requestAnimationFrame(() => {
        currentTarget.select();
      });
    }
  });

  const onKeyDownCapture = useEvent((event: React.KeyboardEvent<HTMLInputElement>) => {
    restProps.onKeyDownCapture?.(event);
    setStepUp(event.shiftKey);
  });

  const onKeyUpCapture = useEvent((event: React.KeyboardEvent<HTMLInputElement>) => {
    restProps.onKeyUpCapture?.(event);
    setStepUp(event.shiftKey);
  });

  return (
    <Box
      {...restProps}
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
