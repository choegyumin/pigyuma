import { NumberInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';

type Value = number | null;

type NumberInputCustomProps = {
  type?: Extract<ComponentPropsWithoutRefByBox<'input'>['type'], 'number' | 'range'>;
  value?: Value;
  defaultValue?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: Value) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, value: Value) => void;
  autoSelect?: boolean;
};

export type NumberInputProps = Omit<
  ComponentPropsWithoutRefByBox<'span'> & NumberInputOnlyHTMLAttributes<HTMLInputElement>,
  keyof NumberInputCustomProps
> &
  NumberInputCustomProps;
export type NumberInputRef = ComponentElementRefByBox<'input'>;
