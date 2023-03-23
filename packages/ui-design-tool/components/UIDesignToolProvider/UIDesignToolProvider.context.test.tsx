import { Canvas } from '@/api/Canvas/model';
import { InteractionType, TransformMethod, UIDesignTool } from '@/api/UIDesignTool';
import { UIRecord } from '@/api/UIRecord/model';
import { UIRecordKey, UIRecordType } from '@/types/Identifier';
import { cloneDeep } from '@pigyuma/utils';
import { act, renderHook } from '@testing-library/react';
import { UIDesignToolProvider } from './UIDesignToolProvider';
import { useUIController, useUIData } from './UIDesignToolProvider.context';

describe('useUIData', () => {
  let recordKey: UIRecordKey;
  let record: UIRecord;

  let uiDesignTool: UIDesignTool;

  let wrapper: React.FunctionComponent;

  beforeEach(() => {
    recordKey = 'dummy';
    record = new UIRecord({
      key: recordKey,
      type: UIRecordType.layer,
    });

    uiDesignTool = new UIDesignTool({ strict: false });
    uiDesignTool.reset([record] as Canvas['children']);

    wrapper = ({ children }: React.PropsWithChildren) => <UIDesignToolProvider api={uiDesignTool}>{children}</UIDesignToolProvider>;
  });

  test('should return UIDesignTool status', () => {
    const { result } = renderHook(() => useUIData(), { wrapper });
    const { status } = result.current;
    expect(status).toEqual({ interactionType: InteractionType.idle, transformMethod: TransformMethod.unable });
  });

  test('should return UIRecord data', () => {
    const { result } = renderHook(() => useUIData(), { wrapper });
    const { get, pairs, tree } = result.current;

    expect(get(recordKey)).toEqual(record);
    expect(get(recordKey)).not.toBe(record);

    expect(pairs.size).toBe(2);
    expect(pairs.get(recordKey)).toEqual(record);
    expect(pairs.get(recordKey)).not.toBe(record);

    expect(tree.children.length).toBe(1);
    expect(tree.children.find(({ key }) => key === recordKey)).toEqual(record);
    expect(tree.children.find(({ key }) => key === recordKey)).not.toBe(record);
  });

  test('should update UIRecord data', async () => {
    const newRecordChanges: Partial<UIRecord> = { type: UIRecordType.artboard };

    const { result: uiControllerResult } = renderHook(() => useUIController(), { wrapper });
    const { result: uiDataResult } = renderHook(() => useUIData(), { wrapper });

    const uiController = uiControllerResult.current;

    await act(async () => {
      uiController.set(recordKey, newRecordChanges);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const { get, pairs, tree } = uiDataResult.current;

    const uiRecordByGet = get(recordKey);
    const uiRecordFromPairs = pairs.get(recordKey);
    const uiRecordFromTree = tree.children.find(({ key }) => key === recordKey);

    expect(uiRecordByGet).toEqual(Object.assign(cloneDeep(record), newRecordChanges));
    expect(uiRecordByGet).not.toBe(record);
    expect(uiRecordByGet).not.toBe(newRecordChanges);

    expect(uiRecordFromPairs).toEqual(Object.assign(cloneDeep(record), newRecordChanges));
    expect(uiRecordFromPairs).not.toBe(record);
    expect(uiRecordFromPairs).not.toBe(newRecordChanges);

    expect(uiRecordFromTree).toEqual(Object.assign(cloneDeep(record), newRecordChanges));
    expect(uiRecordFromTree).not.toBe(record);
    expect(uiRecordFromTree).not.toBe(newRecordChanges);
  });
});
