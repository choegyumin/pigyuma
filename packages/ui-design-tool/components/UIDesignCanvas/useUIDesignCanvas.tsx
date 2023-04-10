import useInstanceID from '@/hooks/useInstanceID';
import useMode from '@/hooks/useMode';
import useUIController from '@/hooks/useUIController';
import { useMount } from '@pigyuma/react-utils';
import { cloneDeep } from '@pigyuma/utils';
import { UIDesignCanvasProps, UIDesignCanvasRef } from './types';

/** @todo 설계가 일정 수준 이상 확정되면: 테스트 코드 작성 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useUIDesignCanvas(props: UIDesignCanvasProps, ref: React.ForwardedRef<UIDesignCanvasRef>) {
  const { initialData } = props;

  const id = useInstanceID();
  const mode = useMode();
  const uiController = useUIController();

  useMount(() => {
    uiController.reset(cloneDeep(initialData));
  });

  return { id, mode };
}
