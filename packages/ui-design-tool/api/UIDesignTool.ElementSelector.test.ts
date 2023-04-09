import { UIDesignTool } from './UIDesignTool';

describe('UIDesignTool - ElementSelector', () => {
  let uiDesignTool: UIDesignTool;

  beforeEach(() => {
    uiDesignTool = new UIDesignTool();
  });

  describe('getBrowserMeta', () => {
    test('should return metadata of browser', () => {
      const { getBrowserMeta } = uiDesignTool.mount();
      expect(getBrowserMeta()).toEqual({
        keyboard: {
          altKey: false,
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
        },
        mouse: {
          clientX: 0,
          clientY: 0,
          offsetX: 0,
          offsetY: 0,
        },
      });
    });
  });
});
