/* eslint-disable */

import React from 'react';
import Box from './Box';
import { DynamicComponentPropsWithoutRef } from './types';

interface FooProps extends React.ComponentPropsWithoutRef<'label'> {}
type FooRefInstance = React.ElementRef<'label'>;

const Foo = React.forwardRef<FooRefInstance, FooProps>((props, ref) => {
  const { children } = props;
  return (
    <label ref={ref}>
      <textarea>{children}</textarea>
    </label>
  );
});
Foo.displayName = 'Foo';

interface BarProps extends React.ComponentPropsWithoutRef<'label'> {
  string: string;
  optionalNumber?: number;
}
type BarRefInstance = React.ElementRef<'label'>;

const Bar = React.forwardRef<BarRefInstance, BarProps>((props, ref) => {
  const { children } = props;
  return (
    <label ref={ref}>
      <textarea>{children}</textarea>
    </label>
  );
});
Bar.displayName = 'Foo';

type FromFooProps = DynamicComponentPropsWithoutRef<typeof Foo>;
type FromFooRefInstance = React.ElementRef<typeof Foo>;
type FromFooType = React.ElementType<typeof Foo>;

type FromBarProps = DynamicComponentPropsWithoutRef<typeof Bar>;
type FromBarRefInstance = React.ElementRef<typeof Foo>;
type FromBarType = React.ElementType<typeof Foo>;

type ErrorProp = FooProps['any'] | BarProps['any'];
type HTMLForProp = FooProps['htmlFor'] | BarProps['htmlFor'];
type StringProp = BarProps['string'];
type OptionalNumberProp = BarProps['optionalNumber'];

const SuccessSample = () => {
  // prettier-ignore
  return (
    <>
      {/* Box는 `className`과 `children`을 받을 수 있어야 한다. */}
      <Box className="class">Hello</Box>
      {/* button Box는 `type`을 받을 수 있어야 한다. */}
      <Box as="button" type="submit" />
      {/* input Box는 `value`를 받을 수 있어야 한다. */}
      <Box as="input" value="Hello" />
      {/* Foo(label) Box는 `htmlFor`를 받을 수 있어야 한다. */}
      <Box as={Foo} htmlFor="id" />
      {/* Bar(label) Box는 `htmlFor`와 `string`, `optionalNumber`를 받을 수 있어야 한다. */}
      <Box as={Bar} htmlFor="id" string="s" optionalNumber={undefined} />
    </>
  );
};

const FailureSample = () => {
  // prettier-ignore
  return (
    <>
      {/* Box는 `type`을 받으면 오류가 발생해야 한다. */}
      <Box type="button">Hello</Box>
      {/* label Box는 `type`을 받으면 오류가 발생해야 한다. */}
      <Box as="label" type="submit" />
      {/* p Box는 `value`를 받으면 오류가 발생해야 한다. */}
      <Box as="p" value="Hello" />
      {/* Foo(label) Box는 `test`를 받으면 오류가 발생해야 한다. */}
      <Box as={Foo} test="dummy" />
      {/* Bar(label) Box는 `string`를 받지 못하면 오류가 발생해야 한다. */}
      <Box as={Bar} htmlFor="id" />
      {/* Bar(label) Box는 `optionalNumber`로 string을 받으면 오류가 발생해야 한다. */}
      <Box as={Bar} htmlFor="id" string="s" optionalNumber="s" />
    </>
  );
};
