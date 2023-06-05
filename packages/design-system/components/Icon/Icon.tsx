import MDIIcon from '@mdi/react';
import { Box } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React from 'react';
import * as styles from './Icon.css';
import { IconPath, IconProps, IconRefInstance, InitialIconProps } from './types';

const Icon = React.forwardRef<IconRefInstance, IconProps>((props, ref) => {
  const { type, color, size, rotate: rotateProp, flipX: flipXProp, flipY: flipYProp, spin, className, style, ...restProps } = props;

  const initialProps = InitialIconProps[type];

  const path = IconPath[type];
  const horizontal = initialProps?.flipX != flipXProp;
  const vertical = initialProps?.flipY != flipYProp;
  const rotate = (initialProps?.rotate ?? 0) + (rotateProp ?? 0);

  return (
    <Box
      {...restProps}
      ref={ref as React.ComponentProps<typeof MDIIcon>['ref']}
      as={MDIIcon}
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
