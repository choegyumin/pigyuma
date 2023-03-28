export default function waitAsyncPaint(): Promise<void> {
  return new Promise((resolve) => {
    // | 해결 방법                          | 결과                                                                                                   |
    // | ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
    // | requestAnimationFrame * 1          | API는 다음 paint 시점을 보장하지만, React Life cycle로 인해 effect가 간헐적으로 paint 완료 전에 실행됨 |
    // | requestAnimationFrame * 2          | effect가 paint 완료 후 실행되지만, 눈에 띄게 느리게 실행됨                                             |
    // | setTimeout * 1                     | (대부분) 문제가 발생하지 않지만, API 스펙 상 다음 paint 시점을 보장하지 않음                           |
    // | requestAnimationFrame + setTimeout | effect가 paint 완료 후 적절한 시점에 실행됨                                                            |
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        resolve();
      }, 0);
    });
  });
}
