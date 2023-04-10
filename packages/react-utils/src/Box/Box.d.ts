import { DynamicComponentByBox } from './types';

interface BoxComponent extends DynamicComponentByBox {}

/** @todo react-utils 패키지로 이관 */
declare const Box: BoxComponent;

export default Box;
