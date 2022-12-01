import React from 'react';
import Box, { DynamicComponentPropsByBox, DynamicComponentByBox, ComponentPropsByBox, ComponentRefByBox } from '../../patterns/Box';
import Button from '../Button';

/* ====================================================================== */

export const SampleOfTypesChecking: React.FC = () => {
  return (
    <>
      <Box as="button" type="submit" />
      <Box as={Button} type="submit" />

      <Box as="button" type="invalid" />
      <Box as={Button} type="invalid" />
    </>
  );
};

/* ====================================================================== */

type SampleProps = ComponentPropsByBox<'section'> & { customProp: boolean };
type SampleRef = ComponentRefByBox<'section'>;

const TagSample = React.forwardRef<SampleRef, SampleProps>((props, ref) => {
  return <section {...props} ref={ref} />;
});
TagSample.displayName = 'TagSample';

const BoxSample = React.forwardRef<SampleRef, SampleProps>((props, ref) => {
  return <Box as="section" {...props} ref={ref} />;
});
BoxSample.displayName = 'BoxSample';

export const SampleOfTagVSBox: React.FC = () => {
  return (
    <>
      <TagSample />
      <BoxSample />

      <TagSample customProp={true} />
      <BoxSample customProp={true} />

      <TagSample customProp={1234} />
      <BoxSample customProp={1234} />

      <TagSample customProp={true} invalidProp={true} />
      <BoxSample customProp={true} invalidProp={true} />

      <Box as={TagSample} />
      <Box as={BoxSample} />

      <Box as={TagSample} customProp={true} />
      <Box as={BoxSample} customProp={true} />

      <Box as={TagSample} customProp={1234} />
      <Box as={BoxSample} customProp={1234} />

      <Box as={TagSample} customProp={true} invalidProp={true} />
      <Box as={BoxSample} customProp={true} invalidProp={true} />
    </>
  );
};

/* ====================================================================== */

type CustomProp = ComponentPropsByBox<typeof BoxSample>['customProp'];

let customProp: CustomProp = 'string';
customProp = true;
customProp = 1234;
console.log(customProp);

/* ====================================================================== */

type ExtendedBoxCustomProps = { customProp: boolean };
type ExtendedBoxProps = DynamicComponentPropsByBox<{ customProp: boolean }>;
interface ExtendedBoxFunction extends DynamicComponentByBox<ExtendedBoxCustomProps> {}
export const ExtendedBox = React.forwardRef<HTMLElement, ExtendedBoxProps>((props, ref) => (
  <Box {...props} ref={ref} />
)) as ExtendedBoxFunction;
ExtendedBox.displayName = 'ExtendedBox';

type UsingExtendedBoxProps = ComponentPropsByBox<typeof ExtendedBox | 'button'> & { customProp: boolean };
type UsingExtendedBoxRef = ComponentRefByBox<typeof ExtendedBox | 'button'>;
export const UsingExtendedBox = React.forwardRef<UsingExtendedBoxRef, UsingExtendedBoxProps>((props, ref) => (
  <Box {...props} ref={ref} as="button" />
));
UsingExtendedBox.displayName = 'UsingExtendedBox';

export const SampleOfExtends: React.FC = () => {
  return (
    <>
      <ExtendedBox as="button" customProp={true} />
      <ExtendedBox as="button" customProp={1234} />
      <ExtendedBox as="button" customProp={true} type="submit" />
      <ExtendedBox as="button" customProp={true} type="invalid" />

      <UsingExtendedBox as="button" />

      <UsingExtendedBox customProp={true} />
      <UsingExtendedBox customProp={1234} />
      <UsingExtendedBox customProp={true} type="submit" />
      <UsingExtendedBox customProp={true} type="invalid" />
    </>
  );
};
