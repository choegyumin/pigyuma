import { createUIRecordSelector } from './selector';

describe('createUIRecordSelector', () => {
  test('should return correct selector', () => {
    expect(
      createUIRecordSelector({
        key: 'foo',
      }),
    ).toBe('[data-ui-record-key="foo"]');
    expect(
      createUIRecordSelector({
        key: 'bar',
        type: 'artboard',
      }),
    ).toBe('[data-ui-record-key="bar"][data-ui-record-type="artboard"]');
    expect(
      createUIRecordSelector({
        key: 'baz',
        type: 'layer',
        layerType: 'shape',
      }),
    ).toBe('[data-ui-record-key="baz"][data-ui-record-type="layer"][data-ui-record-layer-type="shape"]');
  });

  test('should return correct selector when passed filter array', () => {
    expect(createUIRecordSelector([{ key: 'foo' }, { key: 'bar' }, { key: 'baz' }])).toBe(
      '[data-ui-record-key="foo"],[data-ui-record-key="bar"],[data-ui-record-key="baz"]',
    );
  });
});
