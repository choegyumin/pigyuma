import { CheckableInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';

type Value = string | number;

type RadioCustomProps = {
  value?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | undefined) => void;
  cancelable?: boolean;
};

export type RadioProps = Omit<
  ComponentPropsWithoutRefByBox<'span'> & CheckableInputOnlyHTMLAttributes<HTMLInputElement>,
  keyof RadioCustomProps | 'type'
> &
  RadioCustomProps;
export type RadioRef = ComponentElementRefByBox<'input'>;
