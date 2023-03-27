import { useEvent, useForkedRef } from '@pigyuma/react-utils';
import React, { useCallback, useState } from 'react';
import Box from '../Box';
import { NumberInputProps, NumberInputRef } from './types';

/**
 * @todo NumberInput 컴포넌트 고도화
 * - `step`이 `value`, `min`, `max` HTML Attributes 대신, 현재 입력된 값을 기준으로 동작하도록 개선
 */
const NumberInput = React.forwardRef<NumberInputRef, NumberInputProps>((props, ref) => {
  const { autoSelect, ...restProps } = props;
  const forkedRef = useForkedRef(ref);

  const [stepUp, setStepUp] = useState<boolean>(false);
  const step = Number(restProps.step ?? 1) * (stepUp ? 10 : 1);

  const convertTargetValue = useCallback((string: string): number | null => (string ? Number(string) : null), []);

  const onChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    restProps.onChange?.(event, convertTargetValue(event.currentTarget.value));
  });

  const onChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    restProps.onChangeCapture?.(event, convertTargetValue(event.currentTarget.value));
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
      value={restProps.value === null ? '' : restProps.value}
      defaultValue={restProps.defaultValue === null ? '' : restProps.defaultValue}
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
