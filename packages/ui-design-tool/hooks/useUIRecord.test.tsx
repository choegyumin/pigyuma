import { Canvas } from '@/api/Canvas/model';
import { UIDesignTool } from '@/api/UIDesignTool';
import { UIRecord } from '@/api/UIRecord/model';
import { UIDesignToolProvider } from '@/components/UIDesignToolProvider/UIDesignToolProvider';
import useUIController from '@/hooks/useUIController';
import useUIRecord from '@/hooks/useUIRecord';
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
    expect(result.current).toBeUndefined();
  });

  test('should return UIRecord when recordKey is passed', () => {
    const { result } = renderHook(() => useUIRecord(recordKey), { wrapper });
    expect(result.current).toEqual(record);
    expect(result.current).not.toBe(record);
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
