import ReactTypes from '@pigyuma/react-utility-types';
import React from 'react';

// type BoxProps<
//   P extends ReactTypes.UnknownProps = ReactTypes.UnknownProps,
//   T extends React.ElementType<P> = React.ElementType<P>,
// > = React.ComponentProps<T> & {
//   as: T;
// };

type BoxPropsWithoutRef<
  P extends ReactTypes.UnknownProps = ReactTypes.UnknownProps,
  T extends React.ElementType<P> = React.ElementType<P>,
> = React.ComponentPropsWithoutRef<T> & {
  as: T;
};

type BoxPropsWithRef<
  P extends ReactTypes.UnknownProps = ReactTypes.UnknownProps,
  T extends React.ElementType<P> = React.ElementType<P>,
> = React.ComponentPropsWithRef<T> & {
  as: T;
};

type BoxPropsWithoutAs<P extends ReactTypes.UnknownProps, T extends React.ElementType<P> = React.ElementType<P>> = Omit<
  BoxPropsWithoutRef<P, T>,
  'as'
>;

type BoxPropsWithAs<P extends ReactTypes.UnknownProps, T extends React.ElementType<P> = React.ElementType<P>> = BoxPropsWithoutAs<P, T> & {
  as: React.ElementType;
};

type BoxRef<
  P extends ReactTypes.UnknownProps,
  T extends React.ElementType<P> = React.ElementType<P>,
  R extends PickExisting<BoxPropsWithRef<P, T>, 'ref'>['ref'] = PickExisting<BoxPropsWithRef<P, T>, 'ref'>['ref'],
> = NonNullable<
  R extends (instance: infer I) => void ? I : R extends React.MutableRefObject<infer O> | React.RefObject<infer O> ? O : never
>;

type BoxForwardingProps<P extends ReactTypes.UnknownProps, T extends React.ElementType<P> = React.ElementType<P>> = {
  props: BoxPropsWithoutAs<P, T>;
  ref: BoxRef<P, T>;
};

type ComponentForwardingPropsByBox<T extends React.ElementType> = BoxForwardingProps<ReactTypes.UnknownProps, T>;

/**
 * 컴포넌트(`as`)를 지정해 새로운 컴포넌트를 작성할 때 컴포넌트의 `ref`를 제외한 Props 타입을 구하기 위해 사용
 * @example
 * export type MyButtonProps = ComponentPropsWithoutRefByBox<'button'> & { myProp: boolean; }
 * export const MyButton: React.FC<MyButtonProps> = ({ myProp, ...restProps }) => {
 *   return <Box {...restProps} as="button" />
 * };
 */
export type ComponentPropsWithoutRefByBox<T extends React.ElementType> = ComponentForwardingPropsByBox<T>['props'];

/**
 * 컴포넌트(`as`)를 지정해 새로운 컴포넌트를 작성할 때 컴포넌트의 Ref 타입을 구하기 위해 사용
 * @example
 * export type MyButtonRef = ComponentElementRefByBox<'button'>
 * export const MyButton = React.forwardRef<MyButtonRef, {}>((props, ref) => {
 *   return <Box {...props} ref={ref} as="button" />
 * });
 */
export type ComponentElementRefByBox<T extends React.ElementType> = ComponentForwardingPropsByBox<T>['ref'];

export type ComponentRefByBox<T extends React.ElementType> = React.RefObject<ComponentElementRefByBox<T>>;

export type ComponentPropsWithRefByBox<T extends React.ElementType> = ComponentPropsWithoutRefByBox<T> & { ref?: ComponentRefByBox<T> };

export type ComponentPropsByBox<T extends React.ElementType> = ComponentPropsWithRefByBox<T>;

/**
 * 새로운 다이나믹 컴포넌트를 작성할 때 컴포넌트의 Props 타입을 구하기 위해 사용
 * @example
 * type CustomProps = { myProp: boolean; };
 * export type MyComponentProps = DynamicPropsByBox<CustomProps>;
 */
export type DynamicComponentPropsByBox<C extends ReactTypes.UnknownProps> = BoxPropsWithAs<ReactTypes.UnknownProps> & C;

/**
 * 새로운 다이나믹 컴포넌트를 작성할 때 컴포넌트 함수의 타입을 구하기 위해 사용
 * @example
 * type CustomProps = { myProp: boolean; };
 * export type MyComponentProps = DynamicPropsByBox<CustomProps>;
 * export interface MyComponentFunction extends DynamicComponentByBox<CustomProps> {}
 * export const MyComponent = React.forwardRef<HTMLElement, MyComponentProps>(({ myProp, ...restProps }) => {
 *   return <Box {...restProps} ref={ref} />;
 * }) as MyComponentFunction;
 */
export interface DynamicComponentByBox<C extends ReactTypes.UnknownProps = ReactTypes.UnknownProps>
  extends React.ForwardRefExoticComponent<C> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <P extends ReactTypes.UnknownProps = any, T extends React.ElementType<P> = React.ElementType<P>>(
    props: BoxPropsWithRef<P, T> & C,
  ): React.ReactElement<P, T> | null;
}
