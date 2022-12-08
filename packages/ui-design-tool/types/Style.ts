export const UIRecordStyle = {
  x: 'x',
  y: 'y',
  width: 'width',
  height: 'height',
  degrees: 'degrees',
  strokeColor: 'strokeColor',
  strokePattern: 'strokePattern',
  strokeWidth: 'strokeWidth',
  background: 'background',
  textColor: 'textColor',
  fontSize: 'fontSize',
  lineHeight: 'lineHeight',
  fontWeight: 'fontWeight',
  letterSpacing: 'letterSpacing',
} as const;
export type UIRecordStyle = keyof typeof UIRecordStyle;

export const UIRecordStyleVar = {
  [UIRecordStyle.x]: '--x',
  [UIRecordStyle.y]: '--y',
  [UIRecordStyle.width]: '--width',
  [UIRecordStyle.height]: '--height',
  [UIRecordStyle.degrees]: '--degrees',
  [UIRecordStyle.strokeColor]: '--strokeColor',
  [UIRecordStyle.strokePattern]: '--strokePattern',
  [UIRecordStyle.strokeWidth]: '--strokeWidth',
  [UIRecordStyle.background]: '--background',
  [UIRecordStyle.textColor]: '--textColor',
  [UIRecordStyle.fontSize]: '--fontSize',
  [UIRecordStyle.lineHeight]: '--lineHeight',
  [UIRecordStyle.fontWeight]: '--fontWeight',
  [UIRecordStyle.letterSpacing]: '--letterSpacing',
} as const;
