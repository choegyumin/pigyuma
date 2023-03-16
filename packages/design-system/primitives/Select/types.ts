import OptionUnstyled from '@mui/base/OptionUnstyled';
import SelectUnstyled, {
  SelectUnstyledListboxSlotProps,
  SelectUnstyledPopperSlotProps,
  SelectUnstyledRootSlotProps,
} from '@mui/base/SelectUnstyled';
import { ComponentPropsWithoutRefByBox, ComponentElementRefByBox } from '../Box';

export type SelectValue = string | number;

export type SelectProps = Omit<ComponentPropsWithoutRefByBox<typeof SelectUnstyled<SelectValue>>, 'component'>;
export type SelectRef = ComponentElementRefByBox<typeof SelectUnstyled<SelectValue>>;

export type SelectRootProps = SelectUnstyledRootSlotProps<SelectValue, false>;
export type SelectRootRef = HTMLButtonElement;

export type SelectListboxProps = SelectUnstyledListboxSlotProps<SelectValue, false>;
export type SelectListboxRef = HTMLUListElement;

export type SelectPopperProps = SelectUnstyledPopperSlotProps<SelectValue, false>;
export type SelectPopperRef = HTMLDivElement;

export type SelectItemProps = Omit<ComponentPropsWithoutRefByBox<typeof OptionUnstyled<SelectValue>>, 'component'>;
export type SelectItemRef = ComponentElementRefByBox<typeof OptionUnstyled<SelectValue>>;
