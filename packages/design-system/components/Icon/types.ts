import {
  mdiTableLarge,
  mdiCheckboxMultipleBlank,
  mdiSquare,
  mdiHandBackRight,
  mdiHandBackRightOutline,
  mdiGrid,
  mdiFormatText,
  mdiViewDashboard,
  mdiViewAgenda,
  mdiCursorDefaultOutline,
  mdiCursorDefault,
  mdiViewAgendaOutline,
  mdiCheckboxMultipleBlankOutline,
  mdiSquareOutline,
  mdiViewDashboardOutline,
} from '@mdi/js';
import { IconProps as MDIIconProps } from '@mdi/react/dist/IconProps';
import { mapValues } from '@pigyuma/utils';

export const IconPath = {
  columns: mdiViewAgenda,
  columnsOutline: mdiViewAgendaOutline,
  cursor: mdiCursorDefault,
  cursorOutline: mdiCursorDefaultOutline,
  grid: mdiGrid,
  hand: mdiHandBackRight,
  handOutline: mdiHandBackRightOutline,
  layout: mdiViewDashboard,
  layoutOutline: mdiViewDashboardOutline,
  rows: mdiViewAgenda,
  rowsOutline: mdiViewAgendaOutline,
  stack: mdiCheckboxMultipleBlank,
  stackOutline: mdiCheckboxMultipleBlankOutline,
  square: mdiSquare,
  squareOutline: mdiSquareOutline,
  table: mdiTableLarge,
  text: mdiFormatText,
} as const;

export const IconType = mapValues(IconPath, (value, key) => key) as { [K in keyof typeof IconPath]: K };
export type IconType = keyof typeof IconType;

export const InitialIconProps: { [K in IconType]?: Partial<Pick<IconProps, 'rotate' | 'flipX' | 'flipY'>> } = {
  [IconType.columns]: {
    rotate: 90,
  },
} as const;

export interface IconProps
  extends Pick<React.SVGAttributes<SVGElement>, 'role' | 'id' | 'className' | 'style' | 'tabIndex'>,
    React.DOMAttributes<SVGElement>,
    React.AriaAttributes {
  type: IconType;
  color?: MDIIconProps['color'];
  size?: MDIIconProps['size'];
  rotate?: MDIIconProps['rotate'];
  flipX?: MDIIconProps['horizontal'];
  flipY?: MDIIconProps['vertical'];
  spin?: MDIIconProps['spin'];
}
export type IconRefInstance = SVGElement;
