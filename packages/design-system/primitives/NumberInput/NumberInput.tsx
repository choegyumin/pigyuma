import { useEvent, useForkedRef, Box } from '@pigyuma/react-utils';
import React, { useCallback, useState } from 'react';
import { NumberInputProps, NumberInputRef } from './types';

/**
 * @todo NumberInput 컴포넌트 고도화
 * - `step`이 `value`, `min`, `max` HTML Attributes 대신, 현재 입력된 값을 기준으로 동작하도록 개선
 */
const NumberInput = React.forwardRef<NumberInputRef, NumberInputProps>((props, ref) => {
  const {
    autoSelect,
    value: valueProp,
    defaultValue: defaultValueProp,
    step: stepProp,
    onChange,
    onChangeCapture,
    onFocusCapture,
    onKeyDownCapture,
    onKeyUpCapture,
    ...rootProps
  } = props;
  const forkedRef = useForkedRef(ref);

  const value = valueProp === null ? '' : valueProp;
  const defaultValue = defaultValueProp === null ? '' : defaultValueProp;

  const [stepUp, setStepUp] = useState<boolean>(false);
  const step = Number(stepProp ?? 1) * (stepUp ? 10 : 1);

  const convertTargetValue = useCallback((string: string): number | null => (string ? Number(string) : null), []);

  const onFieldChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event, convertTargetValue(event.currentTarget.value));
  });

  const onFieldChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    onChangeCapture?.(event, convertTargetValue(event.currentTarget.value));
  });

  const onFieldFocusCapture = useEvent((event: React.FocusEvent<HTMLInputElement>) => {
    onFocusCapture?.(event);
    if (autoSelect) {
      const { currentTarget } = event;
      window.requestAnimationFrame(() => {
        currentTarget.select();
      });
    }
  });

  const onFieldKeyDownCapture = useEvent((event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDownCapture?.(event);
    setStepUp(event.shiftKey);
  });

  const onFieldKeyUpCapture = useEvent((event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyUpCapture?.(event);
    setStepUp(event.shiftKey);
  });

  return (
    <Box
      {...rootProps}
      ref={forkedRef}
      as="input"
      type="number"
      inputMode="decimal"
      spellCheck={false}
      value={value}
      defaultValue={defaultValue}
      step={step}
      onChange={onFieldChange}
      onChangeCapture={onFieldChangeCapture}
      onFocusCapture={onFieldFocusCapture}
      onKeyDownCapture={onFieldKeyDownCapture}
      onKeyUpCapture={onFieldKeyUpCapture}
    />
  );
});
NumberInput.displayName = 'NumberInput';

export default NumberInput;
