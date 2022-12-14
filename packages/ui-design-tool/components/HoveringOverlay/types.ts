export type HoveringOverlayChangeEvent = { target: HTMLElement | null };

export type HoveringOverlayProps = {
  onChange?: (event: HoveringOverlayChangeEvent) => void;
};

export type HoveringOverlayRef = {
  on: () => void;
  off: () => void;
};
