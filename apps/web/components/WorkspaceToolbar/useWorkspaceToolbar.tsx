import { useEvent } from '@pigyuma/react-utils';
import { useUIController, useUIData } from '@pigyuma/ui-design-tool';
import { UIDesignToolMode, UIDesignToolStatus } from '@pigyuma/ui-design-tool/types/Status';
import { WorkspaceToolbarProps, WorkspaceToolbarRef } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useWorkspaceToolbar(props: WorkspaceToolbarProps, ref: React.ForwardedRef<WorkspaceToolbarRef>) {
  const uiController = useUIController();
  const uiData = useUIData();

  const selectedMode = uiData.mode;

  const onSelectClick = useEvent(() => {
    uiController.toggleMode(UIDesignToolMode.select);
  });

  const onArtboardClick = useEvent(() => {
    uiController.toggleMode(UIDesignToolMode.artboard);
  });

  const onShapeClick = useEvent(() => {
    uiController.toggleMode(UIDesignToolMode.shape);
  });

  const onTextClick = useEvent(() => {
    uiController.toggleMode(UIDesignToolMode.text);
  });

  const onHandClick = useEvent(() => {
    uiController.toggleMode(UIDesignToolMode.hand);
  });

  const onDocumentKeyDown = useEvent((event: KeyboardEvent) => {
    if (uiData.status !== UIDesignToolStatus.idle) {
      return;
    }
    switch (event.code) {
      case 'KeyV':
        return uiController.toggleMode(UIDesignToolMode.select);
      case 'KeyF':
        return uiController.toggleMode(UIDesignToolMode.artboard);
      case 'KeyS':
        return uiController.toggleMode(UIDesignToolMode.shape);
      case 'KeyT':
        return uiController.toggleMode(UIDesignToolMode.text);
      case 'KeyH':
        return uiController.toggleMode(UIDesignToolMode.hand);
    }
  });

  return { selectedMode, onSelectClick, onArtboardClick, onShapeClick, onTextClick, onHandClick, onDocumentKeyDown };
}
