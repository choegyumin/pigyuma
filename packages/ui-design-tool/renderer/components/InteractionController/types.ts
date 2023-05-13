import { UIRecord } from '@/models/UIRecord/model';
import { BrowserStatus } from '@/types/Browser';
import { UIRecordRect } from '@/types/Geometry';
import { DrawingType, HandlePlacement } from '@/types/Identifier';
import { UIDesignToolStatus } from '@/types/Status';
import ReactTypes from '@pigyuma/react-utility-types';

export interface InteractionControllerProps extends ReactTypes.UnknownProps {}

export type BaseInteractionPayload<T extends object | undefined = undefined> = {
  mouse: BrowserStatus['mouse'];
  keyboard: BrowserStatus['keyboard'];
} & (T extends undefined ? { details?: undefined } : { details: T });

export interface BaseInteractionTask<S extends UIDesignToolStatus, T extends object | undefined = undefined> {
  queueing: 'scheduled' | 'running';
  status: S;
  payload: BaseInteractionPayload<T>;
  condition?: (taskPayload: BaseInteractionPayload<T>, pingPayload: BaseInteractionPayload) => boolean;
  enter?: () => void;
  leave?: () => void;
  clear?: () => void;
}

export interface InteractionTarget {
  record: UIRecord;
  rect: UIRecordRect;
}

export type SelectionPayloadDetails = undefined;
export interface MovingPayloadDetails {
  targets: InteractionTarget[];
}
export interface ResizingPayloadDetails {
  targets: InteractionTarget[];
  handlePlacement: HandlePlacement;
}
export interface RotatingPayloadDetails {
  targets: InteractionTarget[];
}
export interface DrawingPayloadDetails {
  target: InteractionTarget | undefined;
  drawingType: typeof DrawingType.artboard | typeof DrawingType.shapeLayer;
}
export interface InputPayloadDetails {
  target: InteractionTarget | undefined;
}

export interface SelectionPayload extends BaseInteractionPayload<SelectionPayloadDetails> {}
export interface MovingPayload extends BaseInteractionPayload<MovingPayloadDetails> {}
export interface ResizingPayload extends BaseInteractionPayload<ResizingPayloadDetails> {}
export interface RotatingPayload extends BaseInteractionPayload<RotatingPayloadDetails> {}
export interface DrawingPayload extends BaseInteractionPayload<DrawingPayloadDetails> {}
export interface InputPayload extends BaseInteractionPayload<InputPayloadDetails> {}

export interface SelectionTask extends BaseInteractionTask<typeof UIDesignToolStatus.selection, SelectionPayloadDetails> {}
export interface MovingTask extends BaseInteractionTask<typeof UIDesignToolStatus.moving, MovingPayloadDetails> {}
export interface ResizingTask extends BaseInteractionTask<typeof UIDesignToolStatus.resizing, ResizingPayloadDetails> {}
export interface RotatingTask extends BaseInteractionTask<typeof UIDesignToolStatus.rotating, RotatingPayloadDetails> {}
export interface DrawingTask extends BaseInteractionTask<typeof UIDesignToolStatus.drawing, DrawingPayloadDetails> {}
export interface InputTask extends BaseInteractionTask<typeof UIDesignToolStatus.input, InputPayloadDetails> {}

export type InteractionTask = SelectionTask | MovingTask | ResizingTask | RotatingTask | DrawingTask | InputTask;

export interface InteractionPing {
  status: UIDesignToolStatus;
  payload: BaseInteractionPayload;
}

export const InteractionActionType = {
  ACTIVATE: 'ACTIVATE',
  DEACTIVATE: 'DEACTIVATE',
  TRIGGER: 'TRIGGER',
} as const;
export type InteractionActionType = keyof typeof InteractionActionType;

export type ActivateAction =
  | {
      type: typeof InteractionActionType.ACTIVATE;
      status: typeof UIDesignToolStatus.selection;
      payload: SelectionPayload;
    }
  | {
      type: typeof InteractionActionType.ACTIVATE;
      status: typeof UIDesignToolStatus.moving;
      payload: MovingPayload;
    }
  | {
      type: typeof InteractionActionType.ACTIVATE;
      status: typeof UIDesignToolStatus.resizing;
      payload: ResizingPayload;
    }
  | {
      type: typeof InteractionActionType.ACTIVATE;
      status: typeof UIDesignToolStatus.rotating;
      payload: RotatingPayload;
    }
  | {
      type: typeof InteractionActionType.ACTIVATE;
      status: typeof UIDesignToolStatus.drawing;
      payload: DrawingPayload;
    }
  | {
      type: typeof InteractionActionType.ACTIVATE;
      status: typeof UIDesignToolStatus.input;
      payload: InputPayload;
    };

export type DeactivateAction = {
  type: typeof InteractionActionType.DEACTIVATE;
  payload: BaseInteractionPayload;
};

export type TriggerAction = {
  type: typeof InteractionActionType.TRIGGER;
  payload: BaseInteractionPayload;
};

export type InteractionAction = ActivateAction | DeactivateAction | TriggerAction;
