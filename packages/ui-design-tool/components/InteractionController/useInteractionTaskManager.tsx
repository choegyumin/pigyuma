import useDispatcher from '@/hooks/useDispatcher';
import { UIDesignToolStatus } from '@/types/Status';
import { useStableCallback } from '@pigyuma/react-utils';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { InteractionPing, InteractionTask } from './types';
import useInteractFunctions from './useInteractionFunctions';

export default function useInteractionTaskManager() {
  const { setStatus } = useDispatcher();

  // 이벤트의 시작과 끝을 처리하는 함수는 `flushSync`와 함께 실행해야 함 (e.g. setStatus, interactStart, interactEnd, enter, leave, clear)
  // 기기의 성능이 낮거나 개발자 도구를 열어 렌더링이 느려진 경우,
  // React 액션들의 batching 간격이 길어져 mousedown으로 인한 재조정이 간헐적으로 mousemove 이후 발생
  const [currentTask, setCurrentTask] = useState<InteractionTask>();
  const { interactPrepare, interactStart, interactExecute, interactEnd } = useInteractFunctions();

  const push = useStableCallback((task: Omit<InteractionTask, 'queueing'>) => {
    if (currentTask != null) {
      throw new Error('Interaction task already exists.');
    }
    const newTask = { ...task, queueing: 'scheduled' } as InteractionTask;
    flushSync(() => {
      setStatus(task.status);
      setCurrentTask(newTask);
      interactPrepare(newTask);
    });
  });

  const run = useStableCallback((ping: Omit<InteractionPing, 'status'>) => {
    if (currentTask == null) {
      return;
    }
    const currentPing = { ...ping, status: currentTask.status } as InteractionPing;
    if (currentTask.queueing === 'scheduled') {
      const taskPayload = currentTask.payload;
      const pingPayload = currentPing.payload;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (currentTask.condition?.(taskPayload as any, pingPayload) ?? true) {
        flushSync(() => {
          currentTask.queueing = 'running';
          currentTask.enter?.();
          interactStart(currentPing);
        });
      }
      return;
    }
    interactExecute(currentPing);
  });

  const shift = useStableCallback((ping: Omit<InteractionPing, 'status'>) => {
    if (currentTask == null) {
      return;
    }
    const currentPing = { ...ping, status: currentTask.status } as InteractionPing;
    flushSync(() => {
      setStatus(UIDesignToolStatus.idle);
      currentTask[currentTask.queueing === 'running' ? 'leave' : 'clear']?.();
      interactEnd(currentPing);
      setCurrentTask(undefined);
    });
  });

  return [currentTask, push, run, shift] as const;
}
