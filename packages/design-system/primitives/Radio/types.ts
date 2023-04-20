import { CheckableInputOnlyHTMLAttributes } from '@pigyuma/react-utility-types';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '@pigyuma/react-utils';

type Value = string | number;

interface RadioCustomProps {
  value?: Value;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, selected: Value | undefined) => void;
  onChangeCapture?: (event: React.FormEvent<HTMLInputElement>, selected: Value | undefined) => void;
  cancelable?: boolean;
}

export interface RadioProps
  extends Omit<ComponentPropsWithoutRefByBox<'span'> & CheckableInputOnlyHTMLAttributes<HTMLInputElement>, keyof RadioCustomProps | 'type'>,
    RadioCustomProps {}
export type RadioRef = ComponentElementRefByBox<'input'>;
