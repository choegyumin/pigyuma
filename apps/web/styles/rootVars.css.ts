import { createGlobalVar } from '@pigyuma/css-utils';

const v = <T extends string>(name: T, value: string) => createGlobalVar(':root', name, value);

const asideBackground = v('asideBackground', '#323339');
const asideBorderWidth = v('asideBorderWidth', '1px');
const asideBorderStyle = v('asideBorderStyle', 'solid');
const asideBorderColor = v('asideBorderColor', '#474952');
const asideColor = v('asideColor', '#fff');

export const toolbarBackground = v('toolbarBackground', asideBackground);
export const toolbarBorderWidth = v('toolbarBorderWidth', asideBorderWidth);
export const toolbarBorderStyle = v('toolbarBorderStyle', asideBorderStyle);
export const toolbarBorderColor = v('toolbarBorderColor', asideBorderColor);
export const toolbarColor = v('toolbarColor', asideColor);

export const panelBackground = v('panelBackground', asideBackground);
export const panelBorderWidth = v('panelBorderWidth', asideBorderWidth);
export const panelBorderStyle = v('panelBorderStyle', asideBorderStyle);
export const panelBorderColor = v('panelBorderColor', asideBorderColor);
export const panelColor = v('panelColor', asideColor);
