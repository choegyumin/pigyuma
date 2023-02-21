import { UIRecordElementFilter, UIRecordElementFilterItem } from '@/types/Identifier';
import { kebabCase } from '@pigyuma/utils';

export const NULL_ELEMENT_SELECTOR = '␀';

const makeSelectorItem = (filterItem: UIRecordElementFilterItem): string =>
  Object.entries(filterItem)
    .filter(([, values]) => values != null)
    .map(([prop, values]) =>
      Array.isArray(values)
        ? values.map((value) => `[data-ui-record-${kebabCase(prop)}="${value}"]`).join('')
        : `[data-ui-record-${kebabCase(prop)}="${values}"]`,
    )
    .join('') || NULL_ELEMENT_SELECTOR;

export const createUIRecordSelector = (filter: UIRecordElementFilter): string => {
  return Array.isArray(filter) ? filter.map((filterItem) => makeSelectorItem(filterItem)).join(',') : makeSelectorItem(filter);
};
