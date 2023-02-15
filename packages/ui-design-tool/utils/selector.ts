import { UIRecordElementFilter, UIRecordElementFilterItem } from '@/types/Identifier';
import { kebabCase } from '@pigyuma/utils';

export const NULL_ELEMENT_SELECTOR = '␀';

export const createUIRecordSelector = (filter: UIRecordElementFilter) => {
  const make = (filterItem: UIRecordElementFilterItem) =>
    Object.entries(filterItem)
      .filter(([, values]) => values != null)
      .map(([prop, values]) =>
        Array.isArray(values)
          ? values.map((value) => `[data-ui-record-${kebabCase(prop)}="${value}"]`).join('')
          : `[data-ui-record-${kebabCase(prop)}="${values}"]`,
      )
      .join('') || NULL_ELEMENT_SELECTOR;
  return Array.isArray(filter) ? filter.map((filterItem) => make(filterItem)).join(',') : make(filter);
};
