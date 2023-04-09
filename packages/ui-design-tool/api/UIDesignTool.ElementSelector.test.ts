import { UIDesignTool } from './UIDesignTool';

describe('UIDesignTool - ElementSelector', () => {
  let uiDesignTool: UIDesignTool;

  beforeEach(() => {
    uiDesignTool = new UIDesignTool();
  });

  describe('getBrowserStatus', () => {
    test('should return metadata of browser', () => {
      const { getBrowserStatus } = uiDesignTool.mount();
      expect(getBrowserStatus()).toEqual({
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
