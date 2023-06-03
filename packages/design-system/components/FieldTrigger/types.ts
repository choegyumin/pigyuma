export const FieldTriggerElementType = 'span';
export type FieldTriggerElementType = typeof FieldTriggerElementType;

export interface FieldTriggerCustomProps {}

export interface FieldTriggerProps extends React.ComponentPropsWithoutRef<FieldTriggerElementType>, FieldTriggerCustomProps {}
export type FieldTriggerRefInstance = React.ElementRef<FieldTriggerElementType>;
