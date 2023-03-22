import { mdiTableLarge, mdiCheckboxMultipleBlank, mdiSquare, mdiGrid, mdiFormatText, mdiViewDashboard, mdiViewAgenda } from '@mdi/js';
import { IconProps as MDIIconProps } from '@mdi/react/dist/IconProps';
import { mapValues } from '@pigyuma/utils';

export const IconPath = {
  columns: mdiViewAgenda,
  table: mdiTableLarge,
  stack: mdiCheckboxMultipleBlank,
  square: mdiSquare,
  grid: mdiGrid,
  text: mdiFormatText,
  layout: mdiViewDashboard,
  rows: mdiViewAgenda,
} as const;

export const IconType = mapValues(IconPath, (value, key) => key) as { [K in keyof typeof IconPath]: K };
export type IconType = keyof typeof IconType;

export const InitialIconProps: { [K in IconType]?: Partial<Pick<IconProps, 'rotate' | 'flipX' | 'flipY'>> } = {
  [IconType.columns]: {
    rotate: 90,
  },
} as const;

export type IconProps = Pick<React.SVGAttributes<SVGElement>, 'role' | 'id' | 'className' | 'style' | 'tabIndex'> &
  React.DOMAttributes<SVGElement> &
  React.AriaAttributes & {
    type: IconType;
    color?: MDIIconProps['color'];
    size?: MDIIconProps['size'];
    rotate?: MDIIconProps['rotate'];
    flipX?: MDIIconProps['horizontal'];
    flipY?: MDIIconProps['vertical'];
    spin?: MDIIconProps['spin'];
  };
export type IconRef = SVGElement;
