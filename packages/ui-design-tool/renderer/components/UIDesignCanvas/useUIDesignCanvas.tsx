import useInstanceID from '@/renderer/hooks/useInstanceID';
import useMode from '@/renderer/hooks/useMode';
import useUIController from '@/renderer/hooks/useUIController';
import { useMount } from '@pigyuma/react-utils';
import { cloneDeep } from '@pigyuma/utils';
import { UIDesignCanvasProps, UIDesignCanvasRefInstance } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useUIDesignCanvas(props: UIDesignCanvasProps, ref: React.ForwardedRef<UIDesignCanvasRefInstance>) {
  const { initialData } = props;

  const id = useInstanceID();
  const mode = useMode();
  const uiController = useUIController();

  useMount(() => {
    uiController.reset(cloneDeep(initialData));
  });

  return { id, mode };
}
