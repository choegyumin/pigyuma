import { useEvent, Box } from '@pigyuma/react-utils';
import React, { useCallback } from 'react';
import { CheckboxProps, CheckboxRef } from './types';

const Checkbox = React.forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
  const { value, onChange, onChangeCapture, ...rootProps } = props;

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
        return checked ? value : undefined;
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
    [value],
  );

  const onFieldChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event, getSelected(event.currentTarget));
  });

  const onFieldChangeCapture = useEvent((event: React.FormEvent<HTMLInputElement>) => {
    onChangeCapture?.(event, getSelected(event.currentTarget));
  });

  return (
    <Box
      role="checkbox"
      {...rootProps}
      ref={ref}
      as="input"
      type="checkbox"
      value={value}
      data-value={JSON.stringify(value)}
      data-value-type={typeof value}
      onChange={onFieldChange}
      onChangeCapture={onFieldChangeCapture}
    />
  );
});
Checkbox.displayName = 'Checkbox';

export default Checkbox;
