import { UIDesignToolInteractionType, UIDesignToolStatus, UIDesignToolStatusMeta, UIDesignToolTransformMethod } from '@/types/Status';

export const getStatus = (meta: UIDesignToolStatusMeta): UIDesignToolStatus => {
  if (meta.interactionType === UIDesignToolInteractionType.selection) {
    return UIDesignToolStatus.selection;
  }
  if (meta.interactionType === UIDesignToolInteractionType.drawing) {
    return UIDesignToolStatus.drawing;
  }
  if (meta.interactionType === UIDesignToolInteractionType.transform) {
    if (meta.transformMethod === UIDesignToolTransformMethod.move) {
      return UIDesignToolStatus.moving;
    }
    if (meta.transformMethod === UIDesignToolTransformMethod.resize) {
      return UIDesignToolStatus.resizing;
    }
    if (meta.transformMethod === UIDesignToolTransformMethod.rotate) {
      return UIDesignToolStatus.rotating;
    }
  }
  // if (meta.interactionType === UIDesignToolInteractionType.idle)
  return UIDesignToolStatus.idle;
};

export const getInteractionType = (status: UIDesignToolStatus): UIDesignToolInteractionType => {
  switch (status) {
    case UIDesignToolStatus.idle: {
      return UIDesignToolInteractionType.idle;
    }
    case UIDesignToolStatus.selection: {
      return UIDesignToolInteractionType.selection;
    }
    case UIDesignToolStatus.drawing: {
      return UIDesignToolInteractionType.drawing;
    }
    case UIDesignToolStatus.moving:
    case UIDesignToolStatus.resizing:
    case UIDesignToolStatus.rotating: {
      return UIDesignToolInteractionType.transform;
    }
  }
};

export const getTransformMethod = (status: UIDesignToolStatus): UIDesignToolTransformMethod => {
  switch (status) {
    case UIDesignToolStatus.moving: {
      return UIDesignToolTransformMethod.move;
    }
    case UIDesignToolStatus.resizing: {
      return UIDesignToolTransformMethod.resize;
    }
    case UIDesignToolStatus.rotating: {
      return UIDesignToolTransformMethod.rotate;
    }
    default: {
      return UIDesignToolTransformMethod.unable;
    }
  }
};
