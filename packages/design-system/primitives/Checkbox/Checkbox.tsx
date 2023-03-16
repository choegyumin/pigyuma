import { useEvent } from '@pigyuma/react-utils';
import React, { useCallback } from 'react';
import Box from '../Box';
import { CheckboxProps, CheckboxRef } from './types';

const Checkbox = React.forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
  /**
   * name을 기반으로 Vue.js의 `v-model` 처럼 동작하게 함
   * 마운트 된 엘리먼트만 접근하므로, 특정 컴포넌트 Scope 내에서 제어가 필요한 경우 <CheckboxGroup /> 사용
   * @see {@link https://vuejs.org/guide/essentials/forms.html#checkbox}
   */
  const getSelected = useCallback(
    (checkbox: HTMLInputElement): string | number | Array<string | number> | undefined => {
      const { name, checked } = checkbox;
      const form = checkbox.closest('form');
      const group = (form ?? document).querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name=${name}]`);

      if (group.length <= 1) {
        return checked ? props.value : undefined;
      }

      const values: Array<string | number> = [];
      group.forEach((it) => {
        if (it.checked) {
          const { value: valueString } = it;
          const { value: valueJSON = '', valueType = 'undefined' } = it.dataset;
          if (valueType === 'undefined') {
            return;
          }
          // for NaN, Infinity...
          if (valueType === 'number') {
            return values.push(Number(valueString));
          }
          return values.push(JSON.parse(valueJSON));
        }
      });

      return values;
    },
    [props.value],
  );

  const onChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(event, getSelected(event.currentTarget));
  });

  const onChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    props.onChangeCapture?.(event, getSelected(event.currentTarget));
  });

  return (
    <Box
      role="checkbox"
      {...props}
      ref={ref}
      as="input"
      type="checkbox"
      data-value={JSON.stringify(props.value)}
      data-value-type={typeof props.value}
      onChange={onChange}
      onChangeCapture={onChangeCapture}
    />
  );
});
Checkbox.displayName = 'Checkbox';

export default Checkbox;
