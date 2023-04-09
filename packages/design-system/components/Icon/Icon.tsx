import Box from '@/primitives/Box';
import MDIIcon from '@mdi/react';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Icon.css';
import { IconPath, IconProps, IconRef, InitialIconProps } from './types';

const Icon = React.forwardRef<IconRef, IconProps>((props, ref) => {
  const { type, color, size, rotate: rotateProp, flipX: flipXProp, flipY: flipYProp, spin, className, style, ...restProps } = props;

  const initialProps = InitialIconProps[type];

  const path = IconPath[type];
  const horizontal = initialProps?.flipX != flipXProp;
  const vertical = initialProps?.flipY != flipYProp;
  const rotate = (initialProps?.rotate ?? 0) + (rotateProp ?? 0);

  return (
    <Box
      as={MDIIcon}
      {...restProps}
      ref={ref as React.ComponentProps<typeof MDIIcon>['ref']}
      className={clsx(styles.root, className)}
      path={path}
      horizontal={horizontal}
      vertical={vertical}
      style={{ ...style, fontSize: size ?? style?.fontSize, rotate: rotate ? `${rotate}deg` : undefined }}
    />
  );
});
Icon.displayName = 'Icon';

export default Icon;
