import { UIDesignTool } from '@/api/UIDesignTool';
import { Canvas } from '@/models/Canvas/model';
import { UIRecord } from '@/models/UIRecord/model';
import { UIDesignToolProvider } from '@/renderer/components/UIDesignToolProvider/UIDesignToolProvider';
import useUIController from '@/renderer/hooks/useUIController';
import useUIRecord from '@/renderer/hooks/useUIRecord';
import { UIRecordKey, UIRecordType } from '@/types/Identifier';
import { cloneDeep } from '@pigyuma/utils';
import { act, renderHook } from '@testing-library/react';

describe('useUIRecord', () => {
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

  test('should return undefined when no recordKey passed', () => {
    const { result } = renderHook(() => useUIRecord(undefined), { wrapper });
    const uiRecord = result.current;

    expect(uiRecord).toBeUndefined();
  });

  test('should return UIRecord when recordKey is passed', () => {
    const { result } = renderHook(() => useUIRecord(recordKey), { wrapper });
    const uiRecord = result.current;

    expect(uiRecord).toEqual(record);
    expect(uiRecord).not.toBe(record);
  });

  test('should update UIRecord data', () => {
    const newRecordChanges: Partial<UIRecord> = { type: UIRecordType.artboard };

    const { result: uiControllerResult } = renderHook(() => useUIController(), { wrapper });
    const { result: uiRecordResult } = renderHook(() => useUIRecord(recordKey), { wrapper });

    const uiController = uiControllerResult.current;

    act(() => {
      uiController.set(recordKey, newRecordChanges);
    });

    const uiRecord = uiRecordResult.current;

    expect(uiRecord).toEqual(Object.assign(cloneDeep(record), newRecordChanges));
    expect(uiRecord).not.toBe(record);
    expect(uiRecord).not.toBe(newRecordChanges);
  });
});
