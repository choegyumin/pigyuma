import ReactTypes from '@pigyuma/react-utility-types';
import React from 'react';

/**
 * 새 다이나믹 컴포넌트를 작성할 때, 컴포넌트 함수 타입을 구함.
 * @example
 * interface ButtonCustomProps { color: ButtonColor; }
 * interface ButtonProps extends DynamicComponentPropsWithoutRef<'button', ButtonCustomProps> {}
 * interface ButtonComponent extends DynamicComponent<ButtonCustomProps, 'button'> {}
 * const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ as, color, ...restProps }) => {
 *   return <Box {...restProps} as={as ?? 'button'} ref={ref} />;
 * }) as ButtonComponent;
 */
export interface DynamicComponent<Props extends ReactTypes.UnknownProps = ReactTypes.UnknownProps, Type extends React.ElementType = 'div'>
  extends React.ForwardRefExoticComponent<Props> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <P extends ReactTypes.UnknownProps = any, T extends React.ElementType<P> = React.ElementType<P>>(
    props: Omit<React.ComponentPropsWithRef<T>, 'as' | keyof Props> & Omit<Props, 'as'> & { as: T },
  ): React.ReactElement<P, T> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <P extends ReactTypes.UnknownProps = any>(
    props: Omit<React.ComponentPropsWithRef<Type>, 'as' | keyof Props> & Omit<Props, 'as'>,
  ): React.ReactElement<P, Type> | null;
}

/**
 * 새 다이나믹 컴포넌트를 작성할 때, 컴포넌트 Props 타입을 구함.
 * @example
 * interface ButtonCustomProps { color: ButtonColor; }
 * interface ButtonProps extends DynamicComponentProps<'button', ButtonCustomProps> {}
 */
export type DynamicComponentProps<
  T extends React.ElementType,
  P extends ReactTypes.UnknownProps = ReactTypes.UnknownProps,
> = React.ComponentProps<T> &
  P & {
    as?: React.ElementType;
  };

/**
 * 새 다이나믹 컴포넌트를 작성할 때, Ref를 포함한 컴포넌트 Props 타입을 구함.
 * @example
 * interface ButtonCustomProps { color: ButtonColor; }
 * interface ButtonProps extends DynamicComponentPropsWithRef<'button', ButtonCustomProps> {}
 */
export type DynamicComponentPropsWithRef<
  T extends React.ElementType,
  P extends ReactTypes.UnknownProps = ReactTypes.UnknownProps,
> = React.ComponentPropsWithRef<T> &
  P & {
    as?: React.ElementType;
  };

/**
 * 새 다이나믹 컴포넌트를 작성할 때, Ref를 제외한 컴포넌트 Props 타입을 구함.
 * @example
 * interface ButtonCustomProps { color: ButtonColor; }
 * interface ButtonProps extends DynamicComponentPropsWithoutRef<'button', ButtonCustomProps> {}
 */
export type DynamicComponentPropsWithoutRef<
  T extends React.ElementType,
  P extends ReactTypes.UnknownProps = ReactTypes.UnknownProps,
> = React.ComponentPropsWithoutRef<T> &
  P & {
    as?: React.ElementType;
  };
