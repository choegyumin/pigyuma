/// <reference types="react" />

/** @see {@link https://github.com/Iconscout/react-unicons/issues/25#issuecomment-1080030200} */
declare module '@iconscout/react-unicons' {
  export type UilIconProps = React.ComponentPropsWithoutRef<'svg'> & {
    size?: string | number;
  };

  export type UilIcon = (props: UilIconProps) => JSX.Element;

  /** @see {@link https://iconscout.com/unicons/explore/line} */
  export const UilColumns: UilIcon;
  export const UilGrid: UilIcon;
  export const UilLayersAlt: UilIcon;
  export const UilSquare: UilIcon;
  export const UilTable: UilIcon;
  export const UilText: UilIcon;
  export const UilWebSectionAlt: UilIcon;
  export const UilWindowMaximize: UilIcon;
}
