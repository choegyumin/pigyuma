import { ForwardingPropsByBox } from '@/patterns/Box';

type BaseForwardingProps = ForwardingPropsByBox<'button'>;

export type ButtonProps = BaseForwardingProps['props'];
export type ButtonRef = BaseForwardingProps['ref'];
