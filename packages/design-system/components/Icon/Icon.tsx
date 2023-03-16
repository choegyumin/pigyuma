import type { IconProps, IconRef } from './types';
import type { UilIcon } from '@iconscout/react-unicons';
import * as Unicons from '@iconscout/react-unicons';
import { setRef, useIsomorphicLayoutEffect } from '@pigyuma/react-utils';
import clsx from 'clsx';
import React, { useId } from 'react';
import * as styles from './Icon.css';

function withData(UilIcon: UilIcon) {
  const Icon = React.forwardRef<IconRef, IconProps>((props, ref) => {
    const componentId = useId();
    const { size, ...rootProps } = props;

    useIsomorphicLayoutEffect(() => {
      if (ref) {
        setRef(ref, document.querySelector<SVGElement>(`[data-icon-component-id="${componentId}"]`));
      }
    });

    return (
      <UilIcon
        {...rootProps}
        data-icon-component-id={componentId}
        className={clsx(styles.root, props.className)}
        style={{ ...props.style, fontSize: size ?? props.style?.fontSize }}
      />
    );
  });
  Icon.displayName = 'withData';

  return Icon;
}

// See @pigyuma/tsconfig/react-unicons.d.ts
export const Columns = withData(Unicons.UilColumns);
export const Table = withData(Unicons.UilGrid);
export const Stack = withData(Unicons.UilLayersAlt);
export const Square = withData(Unicons.UilSquare);
export const Grid = withData(Unicons.UilTable);
export const Text = withData(Unicons.UilText);
export const Layout = withData(Unicons.UilWebSectionAlt);
export const Rows = withData(Unicons.UilWindowMaximize);
