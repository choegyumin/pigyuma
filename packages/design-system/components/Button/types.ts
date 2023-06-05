export const ButtonElementType = 'button';
export type ButtonElementType = typeof ButtonElementType;

export interface ButtonCustomProps {}

export interface ButtonProps extends React.ComponentPropsWithoutRef<ButtonElementType>, ButtonCustomProps {}
export type ButtonRefInstance = React.ElementRef<ButtonElementType>;
