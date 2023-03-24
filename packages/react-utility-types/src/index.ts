/**
 * This is technically safe in React, because under the hood the {} type is passed into an intersection type.
 * @see {@link https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type UnknownProps = {};

/**
 * A specific function type would not trigger implicit any.
 * @see {@link https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52873#issuecomment-845806435} for a comparison between `Function` and more specific types.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type CallbackFunction = Function;

/** @see React.InputHTMLAttributes */
export const InputOnlyHTMLAttributeKeys = [
  'accept', // 'file'
  'alt', // 'image'
  'autoComplete', // TextTypes
  'autoFocus', // AllTypes
  'capture', // 'file'
  'checked', // CheckableTypes
  'defaultChecked', // CheckableTypes
  'crossOrigin', // 'image'
  /* 'dirName', // TextTypes */
  'disabled', // AllTypes
  'form', // AllTypes
  'formAction', // 'image' | 'submit'
  'formEncType', // 'image' | 'submit'
  'formMethod', // 'image' | 'submit'
  'formNoValidate', // 'image' | 'submit'
  'formTarget', // 'image' | 'submit'
  'height', // 'image'
  'list', // TextTypes
  'max', // 'number' | 'range'
  'maxLength', // TextTypes
  'min', // 'number' | 'range'
  'minLength', // TextTypes
  'multiple', // 'email' | 'file'
  'name', // AllTypes
  'pattern', // TextTypes
  'placeholder', // TextTypes | 'number'
  'readOnly', // AllTypes
  'required', // AllTypes
  'size', // TextTypes | 'number'
  'src', // 'image'
  'step', // 'number' | 'range'
  'tabIndex', // AllTypes
  'type', // AllTypes
  'value', // AllTypes
  'defaultValue', // TextTypes | 'number' | 'range' | 'color' | 'file'
  'width', // 'image'

  // Focus Events
  'onFocus', // AllTypes
  'onFocusCapture', // AllTypes
  'onBlur', // AllTypes
  'onBlurCapture', // AllTypes

  // Form Events
  'onChange', // AllTypes
  'onChangeCapture', // AllTypes
  'onBeforeInput', // TextTypes | 'number'
  'onBeforeInputCapture', // TextTypes | 'number'
  'onInput', // TextTypes | 'number'
  'onInputCapture', // TextTypes | 'number'
  'onReset', // AllTypes
  'onResetCapture', // AllTypes
  'onSubmit', // AllTypes
  'onSubmitCapture', // AllTypes
  'onInvalid', // AllTypes
  'onInvalidCapture', // AllTypes

  // Keyboard Events
  'onKeyDown', // AllTypes
  'onKeyDownCapture', // AllTypes
  'onKeyPress', // AllTypes
  'onKeyPressCapture', // AllTypes
  'onKeyUp', // AllTypes
  'onKeyUpCapture', // AllTypes

  // Selection Events
  'onSelect', // TextTypes | 'number'
  'onSelectCapture', // TextTypes | 'number'
] as const;
export type InputOnlyHTMLAttributes<T> = Pick<React.InputHTMLAttributes<T>, ArrayElements<typeof InputOnlyHTMLAttributeKeys>>;

/** @see React.InputHTMLAttributes */
export const TextInputOnlyHTMLAttributeKeys = [
  'autoComplete', // TextTypes
  'autoFocus', // AllTypes
  /* 'dirName', // TextTypes */
  'disabled', // AllTypes
  'form', // AllTypes
  'list', // TextTypes
  'maxLength', // TextTypes
  'minLength', // TextTypes
  'multiple', // 'email' | 'file'
  'name', // AllTypes
  'pattern', // TextTypes
  'placeholder', // TextTypes | 'number'
  'readOnly', // AllTypes
  'required', // AllTypes
  'size', // TextTypes | 'number'
  'tabIndex', // AllTypes
  'type', // AllTypes
  'value', // AllTypes
  'defaultValue', // TextTypes | 'number' | 'range' | 'color' | 'file'

  // Focus Events
  'onFocus', // AllTypes
  'onFocusCapture', // AllTypes
  'onBlur', // AllTypes
  'onBlurCapture', // AllTypes

  // Form Events
  'onChange', // AllTypes
  'onChangeCapture', // AllTypes
  'onBeforeInput', // TextTypes | 'number'
  'onBeforeInputCapture', // TextTypes | 'number'
  'onInput', // TextTypes | 'number'
  'onInputCapture', // TextTypes | 'number'
  'onReset', // AllTypes
  'onResetCapture', // AllTypes
  'onSubmit', // AllTypes
  'onSubmitCapture', // AllTypes
  'onInvalid', // AllTypes
  'onInvalidCapture', // AllTypes

  // Keyboard Events
  'onKeyDown', // AllTypes
  'onKeyDownCapture', // AllTypes
  'onKeyPress', // AllTypes
  'onKeyPressCapture', // AllTypes
  'onKeyUp', // AllTypes
  'onKeyUpCapture', // AllTypes

  // Selection Events
  'onSelect', // TextTypes | 'number'
  'onSelectCapture', // TextTypes | 'number'
] as const;
export type TextInputOnlyHTMLAttributes<T> = Pick<React.InputHTMLAttributes<T>, ArrayElements<typeof TextInputOnlyHTMLAttributeKeys>>;

/** @see React.InputHTMLAttributes */
export const NumberInputOnlyHTMLAttributeKeys = [
  'autoFocus', // AllTypes
  'disabled', // AllTypes
  'form', // AllTypes
  'max', // 'number' | 'range'
  'min', // 'number' | 'range'
  'name', // AllTypes
  'placeholder', // TextTypes | 'number'
  'readOnly', // AllTypes
  'required', // AllTypes
  'size', // TextTypes | 'number'
  'step', // 'number' | 'range'
  'tabIndex', // AllTypes
  'type', // AllTypes
  'value', // AllTypes
  'defaultValue', // TextTypes | 'number' | 'range' | 'color' | 'file'

  // Focus Events
  'onFocus', // AllTypes
  'onFocusCapture', // AllTypes
  'onBlur', // AllTypes
  'onBlurCapture', // AllTypes

  // Form Events
  'onChange', // AllTypes
  'onChangeCapture', // AllTypes
  'onBeforeInput', // TextTypes | 'number'
  'onBeforeInputCapture', // TextTypes | 'number'
  'onInput', // TextTypes | 'number'
  'onInputCapture', // TextTypes | 'number'
  'onReset', // AllTypes
  'onResetCapture', // AllTypes
  'onSubmit', // AllTypes
  'onSubmitCapture', // AllTypes
  'onInvalid', // AllTypes
  'onInvalidCapture', // AllTypes

  // Keyboard Events
  'onKeyDown', // AllTypes
  'onKeyDownCapture', // AllTypes
  'onKeyPress', // AllTypes
  'onKeyPressCapture', // AllTypes
  'onKeyUp', // AllTypes
  'onKeyUpCapture', // AllTypes

  // Selection Events
  'onSelect', // TextTypes | 'number'
  'onSelectCapture', // TextTypes | 'number'
] as const;
export type NumberInputOnlyHTMLAttributes<T> = Pick<React.InputHTMLAttributes<T>, ArrayElements<typeof NumberInputOnlyHTMLAttributeKeys>>;

/** @see React.InputHTMLAttributes */
export const CheckableInputOnlyHTMLAttributeKeys = [
  'autoFocus', // AllTypes
  'checked', // CheckableTypes
  'defaultChecked', // CheckableTypes
  'disabled', // AllTypes
  'form', // AllTypes
  'name', // AllTypes
  'readOnly', // AllTypes
  'required', // AllTypes
  'tabIndex', // AllTypes
  'type', // AllTypes
  'value', // AllTypes

  // Focus Events
  'onFocus', // AllTypes
  'onFocusCapture', // AllTypes
  'onBlur', // AllTypes
  'onBlurCapture', // AllTypes

  // Form Events
  'onChange', // AllTypes
  'onChangeCapture', // AllTypes
  'onReset', // AllTypes
  'onResetCapture', // AllTypes
  'onSubmit', // AllTypes
  'onSubmitCapture', // AllTypes
  'onInvalid', // AllTypes
  'onInvalidCapture', // AllTypes

  // Keyboard Events
  'onKeyDown', // AllTypes
  'onKeyDownCapture', // AllTypes
  'onKeyPress', // AllTypes
  'onKeyPressCapture', // AllTypes
  'onKeyUp', // AllTypes
  'onKeyUpCapture', // AllTypes
] as const;
export type CheckableInputOnlyHTMLAttributes<T> = Pick<
  React.InputHTMLAttributes<T>,
  ArrayElements<typeof CheckableInputOnlyHTMLAttributeKeys>
>;

/** @see React.InputHTMLAttributes */
export const ColorInputOnlyHTMLAttributeKeys = [
  'autoFocus', // AllTypes
  'disabled', // AllTypes
  'form', // AllTypes
  'name', // AllTypes
  'readOnly', // AllTypes
  'required', // AllTypes
  'tabIndex', // AllTypes
  'type', // AllTypes
  'value', // AllTypes
  'defaultValue', // TextTypes | 'number' | 'range' | 'color' | 'file'

  // Focus Events
  'onFocus', // AllTypes
  'onFocusCapture', // AllTypes
  'onBlur', // AllTypes
  'onBlurCapture', // AllTypes

  // Form Events
  'onChange', // AllTypes
  'onChangeCapture', // AllTypes
  'onReset', // AllTypes
  'onResetCapture', // AllTypes
  'onSubmit', // AllTypes
  'onSubmitCapture', // AllTypes
  'onInvalid', // AllTypes
  'onInvalidCapture', // AllTypes

  // Keyboard Events
  'onKeyDown', // AllTypes
  'onKeyDownCapture', // AllTypes
  'onKeyPress', // AllTypes
  'onKeyPressCapture', // AllTypes
  'onKeyUp', // AllTypes
  'onKeyUpCapture', // AllTypes
] as const;
export type ColorInputOnlyHTMLAttributes<T> = Pick<React.InputHTMLAttributes<T>, ArrayElements<typeof ColorInputOnlyHTMLAttributeKeys>>;

/** @see React.InputHTMLAttributes */
export const FileInputOnlyHTMLAttributeKeys = [
  'accept', // 'file'
  'autoFocus', // AllTypes
  'capture', // 'file'
  'disabled', // AllTypes
  'form', // AllTypes
  'multiple', // 'email' | 'file'
  'name', // AllTypes
  'readOnly', // AllTypes
  'required', // AllTypes
  'tabIndex', // AllTypes
  'type', // AllTypes
  'value', // AllTypes

  // Focus Events
  'onFocus', // AllTypes
  'onFocusCapture', // AllTypes
  'onBlur', // AllTypes
  'onBlurCapture', // AllTypes

  // Form Events
  'onChange', // AllTypes
  'onChangeCapture', // AllTypes
  'onReset', // AllTypes
  'onResetCapture', // AllTypes
  'onSubmit', // AllTypes
  'onSubmitCapture', // AllTypes
  'onInvalid', // AllTypes
  'onInvalidCapture', // AllTypes

  // Keyboard Events
  'onKeyDown', // AllTypes
  'onKeyDownCapture', // AllTypes
  'onKeyPress', // AllTypes
  'onKeyPressCapture', // AllTypes
  'onKeyUp', // AllTypes
  'onKeyUpCapture', // AllTypes
] as const;
export type FileInputOnlyHTMLAttributes<T> = Pick<React.InputHTMLAttributes<T>, ArrayElements<typeof FileInputOnlyHTMLAttributeKeys>>;

/** @see React.InputHTMLAttributes */
export const ButtonInputOnlyHTMLAttributeKeys = [
  'alt', // 'image'
  'autoFocus', // AllTypes
  'crossOrigin', // 'image'
  'disabled', // AllTypes
  'form', // AllTypes
  'formAction', // 'image' | 'submit'
  'formEncType', // 'image' | 'submit'
  'formMethod', // 'image' | 'submit'
  'formNoValidate', // 'image' | 'submit'
  'formTarget', // 'image' | 'submit'
  'height', // 'image'
  'name', // AllTypes
  'readOnly', // AllTypes
  'required', // AllTypes
  'src', // 'image'
  'tabIndex', // AllTypes
  'type', // AllTypes
  'value', // AllTypes
  'width', // 'image'

  // Focus Events
  'onFocus', // AllTypes
  'onFocusCapture', // AllTypes
  'onBlur', // AllTypes
  'onBlurCapture', // AllTypes

  // Form Events
  'onChange', // AllTypes
  'onChangeCapture', // AllTypes
  'onReset', // AllTypes
  'onResetCapture', // AllTypes
  'onSubmit', // AllTypes
  'onSubmitCapture', // AllTypes
  'onInvalid', // AllTypes
  'onInvalidCapture', // AllTypes

  // Keyboard Events
  'onKeyDown', // AllTypes
  'onKeyDownCapture', // AllTypes
  'onKeyPress', // AllTypes
  'onKeyPressCapture', // AllTypes
  'onKeyUp', // AllTypes
  'onKeyUpCapture', // AllTypes
] as const;
export type ButtonInputOnlyHTMLAttributes<T> = Pick<React.InputHTMLAttributes<T>, ArrayElements<typeof ButtonInputOnlyHTMLAttributeKeys>>;

/** @see React.TextareaHTMLAttributes */
export const TextareaOnlyHTMLAttributeKeys = [
  'autoComplete',
  'autoFocus',
  'cols',
  'dirName',
  'disabled',
  'form',
  'maxLength',
  'minLength',
  'name',
  'placeholder',
  'readOnly',
  'required',
  'rows',
  'tabIndex',
  'value',
  'wrap',

  // Focus Events
  'onFocus', // AllTypes
  'onFocusCapture', // AllTypes
  'onBlur', // AllTypes
  'onBlurCapture', // AllTypes

  // Form Events
  'onChange', // AllTypes
  'onChangeCapture', // AllTypes
  'onBeforeInput', // TextTypes | 'number'
  'onBeforeInputCapture', // TextTypes | 'number'
  'onInput', // TextTypes | 'number'
  'onInputCapture', // TextTypes | 'number'
  'onReset', // AllTypes
  'onResetCapture', // AllTypes
  'onSubmit', // AllTypes
  'onSubmitCapture', // AllTypes
  'onInvalid', // AllTypes
  'onInvalidCapture', // AllTypes

  // Keyboard Events
  'onKeyDown', // AllTypes
  'onKeyDownCapture', // AllTypes
  'onKeyPress', // AllTypes
  'onKeyPressCapture', // AllTypes
  'onKeyUp', // AllTypes
  'onKeyUpCapture', // AllTypes

  // Selection Events
  'onSelect', // TextTypes | 'number'
  'onSelectCapture', // TextTypes | 'number'
] as const;
export type TextareaOnlyHTMLAttributes<T> = Pick<React.TextareaHTMLAttributes<T>, ArrayElements<typeof TextareaOnlyHTMLAttributeKeys>>;

/** @see React.SelectHTMLAttributes */
export const SelectOnlyHTMLAttributeKeys = [
  'autoComplete',
  'autoFocus',
  'disabled',
  'form',
  'multiple',
  'name',
  'required',
  'size',
  'tabIndex',
  'value',
  'defaultValue',

  // Focus Events
  'onFocus',
  'onFocusCapture',
  'onBlur',
  'onBlurCapture',

  // Form Events
  'onChange',
  'onChangeCapture',
  'onReset',
  'onResetCapture',
  'onSubmit',
  'onSubmitCapture',
  'onInvalid',
  'onInvalidCapture',

  // Keyboard Events
  'onKeyDown',
  'onKeyDownCapture',
  'onKeyPress',
  'onKeyPressCapture',
  'onKeyUp',
  'onKeyUpCapture',
] as const;
export type SelectOnlyHTMLAttributes<T> = Pick<React.SelectHTMLAttributes<T>, ArrayElements<typeof SelectOnlyHTMLAttributeKeys>>;

/** @see React.ButtonHTMLAttributes */
export const ButtonOnlyHTMLAttributeKeys = [
  'autoFocus',
  'disabled',
  'form',
  'formAction',
  'formEncType',
  'formMethod',
  'formNoValidate',
  'formTarget',
  'name',
  'type',
  'value',

  // Focus Events
  'onFocus',
  'onFocusCapture',
  'onBlur',
  'onBlurCapture',

  // Keyboard Events
  'onKeyDown',
  'onKeyDownCapture',
  'onKeyPress',
  'onKeyPressCapture',
  'onKeyUp',
  'onKeyUpCapture',
] as const;
export type ButtonOnlyHTMLAttributes<T> = Pick<React.ButtonHTMLAttributes<T>, ArrayElements<typeof ButtonOnlyHTMLAttributeKeys>>;
