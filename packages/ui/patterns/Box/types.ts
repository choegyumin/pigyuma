import ReactTypes from '@pigyuma/react-utility-types';
import React from 'react';

type BoxPropsWithRef<
  P extends ReactTypes.UnknownProps = ReactTypes.UnknownProps,
  T extends React.ElementType<P> = React.ElementType<P>,
> = React.ComponentPropsWithRef<T> & {
  as: T;
};

type BoxProps<P extends ReactTypes.UnknownProps, T extends React.ElementType<P> = React.ElementType<P>> = Omit<
  BoxPropsWithRef<P, T>,
  'ref' | 'as'
>;

type BoxRef<
  P extends ReactTypes.UnknownProps,
  T extends React.ElementType<P> = React.ElementType<P>,
  R extends PickExisting<BoxPropsWithRef<P, T>, 'ref'>['ref'] = PickExisting<BoxPropsWithRef<P, T>, 'ref'>['ref'],
> = R extends (instance: infer I) => void ? I : R extends React.MutableRefObject<infer O> | React.RefObject<infer O> ? O : never;

type BoxForwardingProps<P extends ReactTypes.UnknownProps, T extends React.ElementType<P> = React.ElementType<P>> = {
  props: BoxProps<P, T>;
  ref: BoxRef<P, T>;
};

/**
 * Box 컴포넌트를 이용해 새로운 컴포넌트를 작성할 때 컴포넌트의 Props, Ref 타입을 구하기 위해 사용
 * @example
 * type BaseForwardingProps = ForwardingPropsByBox<'button'>;
 * export type MyComponentProps = BaseForwardingProps['props'] & { myProp: boolean; };
 * export type MyComponentRef = BaseForwardingProps['ref'];
 * export const MyComponent = React.forwardRef<MyComponentRef, MyComponentProps>((props, ref) => <Box {...props} ref={ref} as="div" />);
 */
export type ForwardingPropsByBox<T extends React.ElementType> = BoxForwardingProps<ReactTypes.UnknownProps, T>;

/**
 * Box 컴포넌트를 확장해 새로운 컴포넌트를 작성할 때 컴포넌트 함수의 타입을 구하기 위해 사용
 * @example
 * type CustomProps = { myProp: boolean; };
 * export type MyComponentProps = CustomBoxProps<{ myProp: boolean; }>;
 * export interface MyComponentFunction extends ComponentByBox<CustomProps> {}
 * export const MyComponent = React.forwardRef<HTMLElement, MyComponentProps>((props, ref) => <Box {...props} ref={ref} />) as MyComponentFunction;
 */
export interface ComponentByBox<C extends ReactTypes.UnknownProps = ReactTypes.UnknownProps> extends React.ForwardRefExoticComponent<C> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <P extends ReactTypes.UnknownProps = any, T extends React.ElementType<P> = React.ElementType<P>>(
    props: BoxPropsWithRef<P, T> & C,
  ): React.ReactElement<P, T> | null;
}

export type CustomBoxProps<C extends ReactTypes.UnknownProps> = BoxProps<ReactTypes.UnknownProps> & C;
