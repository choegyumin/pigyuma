import { UIDesignTool } from './UIDesignTool';

describe('UIDesignTool', () => {
  let uiDesignTool: UIDesignTool;

  beforeEach(() => {
    uiDesignTool = new UIDesignTool();
  });

  describe('mount', () => {
    test('should mount when not already mounted', () => {
      uiDesignTool.mount();

      expect(() => uiDesignTool.mount()).toThrow();

      uiDesignTool.unmount();
      expect(() => uiDesignTool.mount()).not.toThrow();
    });
  });
});
