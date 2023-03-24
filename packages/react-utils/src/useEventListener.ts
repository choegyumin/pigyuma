import { useEffect, useMemo } from 'react';

/*
type AllEventMap =
  | AbortSignalEventMap
  | AbstractWorkerEventMap
  | AnimationEventMap
  | AudioScheduledSourceNodeEventMap
  | AudioWorkletNodeEventMap
  | BaseAudioContextEventMap
  | BroadcastChannelEventMap
  | DocumentAndElementEventHandlersEventMap
  | DocumentEventMap
  | ElementEventMap
  | EventSourceEventMap
  | FileReaderEventMap
  | FontFaceSetEventMap
  | GlobalEventHandlersEventMap
  | HTMLBodyElementEventMap
  | HTMLElementEventMap
  | HTMLFrameSetElementEventMap
  | HTMLMediaElementEventMap
  | HTMLVideoElementEventMap
  | IDBDatabaseEventMap
  | IDBOpenDBRequestEventMap
  | IDBRequestEventMap
  | IDBTransactionEventMap
  | MathMLElementEventMap
  | MediaDevicesEventMap
  | MediaKeySessionEventMap
  | MediaQueryListEventMap
  | MediaRecorderEventMap
  | MediaSourceEventMap
  | MediaStreamEventMap
  | MediaStreamTrackEventMap
  | MessagePortEventMap
  | NotificationEventMap
  | OfflineAudioContextEventMap
  | OffscreenCanvasEventMap
  | PaymentRequestEventMap
  | PerformanceEventMap
  | PermissionStatusEventMap
  | PictureInPictureWindowEventMap
  | RTCDTMFSenderEventMap
  | RTCDataChannelEventMap
  | RTCDtlsTransportEventMap
  | RTCIceTransportEventMap
  | RTCPeerConnectionEventMap
  | RTCSctpTransportEventMap
  | RemotePlaybackEventMap
  | SVGElementEventMap
  | SVGSVGElementEventMap
  | ScreenOrientationEventMap
  | ScriptProcessorNodeEventMap
  | ServiceWorkerContainerEventMap
  | ServiceWorkerEventMap
  | ServiceWorkerRegistrationEventMap
  | ShadowRootEventMap
  | SourceBufferEventMap
  | SourceBufferListEventMap
  | SpeechSynthesisEventMap
  | SpeechSynthesisUtteranceEventMap
  | TextTrackCueEventMap
  | TextTrackEventMap
  | TextTrackListEventMap
  | VisualViewportEventMap
  | WebSocketEventMap
  | WindowEventHandlersEventMap
  | WindowEventMap
  | WorkerEventMap
  | XMLHttpRequestEventMap
  | XMLHttpRequestEventTargetEventMap;
*/

type ElementWrapper<T> =
  | T
  // for SSR
  | (() => T)
  // for ReactElement
  | React.RefObject<T>;

function useEventListener<K extends keyof DocumentEventMap>(
  element: ElementWrapper<Document | null>,
  type: K,
  listener?: (this: Document, event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;
function useEventListener<K extends keyof HTMLElementEventMap>(
  element: ElementWrapper<HTMLElement | null>,
  type: K,
  listener?: (this: HTMLElement, event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;
function useEventListener<K extends keyof SVGElementEventMap>(
  element: ElementWrapper<SVGElement | null>,
  type: K,
  listener?: (this: SVGElement, event: SVGElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;
function useEventListener<K extends keyof WindowEventMap>(
  element: ElementWrapper<Window | null>,
  type: K,
  listener?: (this: Window, event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;
function useEventListener<K extends keyof GlobalEventHandlersEventMap>(
  element: ElementWrapper<Document | HTMLElement | SVGElement | Window | null>,
  type: K,
  listener?: (this: Document | HTMLElement | SVGElement | Window, event: Event) => void,
  options?: boolean | AddEventListenerOptions,
): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedElement = useMemo(() => element, []);
  useEffect(() => {
    if (listener == null) {
      return;
    }
    const target = (() => {
      if (memoizedElement instanceof EventTarget) {
        return memoizedElement;
      }
      if (typeof memoizedElement === 'function') {
        return memoizedElement();
      }
      return memoizedElement?.current ?? null;
    })();
    if (target == null) {
      return;
    }
    target.addEventListener(type, listener, options);
    return () => {
      target.removeEventListener(type, listener, options);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, listener, JSON.stringify(options)]);
}

export default useEventListener;
