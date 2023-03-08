import { merge } from '@pigyuma/utils';
import { createGlobalTheme } from '@vanilla-extract/css';
import {
  colorAccentContract,
  colorAccentTokens,
  colorNeutralContract,
  colorNeutralTokens,
  colorTextContract,
  colorTextTokens,
} from './css/_theme/color.css';
import { shadowBoxContract, shadowBoxTokens } from './css/_theme/shadow.css';
import { spacingScaleContract, spacingScaleTokens } from './css/_theme/spacing.css';
import { systemBaseContract, systemBaseTokens, systemInteractionContract, systemInteractionTokens } from './css/_theme/system.css';
import { GlobalThemeTokens } from './css/_theme/types';
import {
  typographyBaseContract,
  typographyBaseTokens,
  typographyFontFamilyContract,
  typographyFontFamilyTokens,
  typographyStylesContract,
  typographyStylesTokens,
} from './css/_theme/typography.css';

export const customizeTheme = (tokens: DeepPartial<GlobalThemeTokens>) => {
  const tokensModules = [
    [colorAccentContract, colorAccentTokens, { color: { accent: tokens.color?.accent } }],
    [colorNeutralContract, colorNeutralTokens, { color: { neutral: tokens.color?.neutral } }],
    [colorTextContract, colorTextTokens, { color: { text: tokens.color?.text } }],
    [shadowBoxContract, shadowBoxTokens, { shadow: { box: tokens.shadow?.box } }],
    [spacingScaleContract, spacingScaleTokens, { spacing: { scale: tokens.spacing?.scale } }],
    [systemBaseContract, systemBaseTokens, { system: { base: tokens.system?.base } }],
    [systemInteractionContract, systemInteractionTokens, { system: { interaction: tokens.system?.interaction } }],
    [typographyBaseContract, typographyBaseTokens, { typography: { base: tokens.typography?.base } }],
    [typographyFontFamilyContract, typographyFontFamilyTokens, { typography: { fontFamily: tokens.typography?.fontFamily } }],
    [typographyStylesContract, typographyStylesTokens, { typography: { styles: tokens.typography?.styles } }],
  ] as const;

  tokensModules.forEach(([contract, defaultTokens, customTokens]) => {
    const tokensByModule = customTokens[Object.keys(customTokens)[0] as keyof typeof customTokens];
    const tokensByCategory = tokensByModule[Object.keys(tokensByModule)[0]];
    if (tokensByCategory != null) {
      createGlobalTheme(':root', contract, merge({}, defaultTokens, customTokens));
    }
  });
};
