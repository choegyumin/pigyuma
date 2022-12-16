import { useEffect } from 'react';

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

function useEventListener<K extends keyof DocumentEventMap>(
  element: Document | null,
  type: K,
  listener?: (this: Document, event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;
function useEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | null,
  type: K,
  listener?: (this: HTMLElement, event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;
function useEventListener<K extends keyof SVGElementEventMap>(
  element: SVGElement | null,
  type: K,
  listener?: (this: SVGElement, event: SVGElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;
function useEventListener<K extends keyof WindowEventMap>(
  element: Window | null,
  type: K,
  listener?: (this: Window, event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void;
function useEventListener<K extends keyof GlobalEventHandlersEventMap>(
  element: Document | HTMLElement | SVGElement | Window | null,
  type: K,
  listener?: (this: Document | HTMLElement | SVGElement | Window, event: Event) => void,
  options?: boolean | AddEventListenerOptions,
): void {
  useEffect(() => {
    if (element == null || listener == null) {
      return;
    }
    element.addEventListener(type, listener, options);
    return () => {
      element.removeEventListener(type, listener, options);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, type, listener, JSON.stringify(options)]);
}

export default useEventListener;
