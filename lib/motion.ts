export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

export function getRevealTransition(
  reducedMotion: boolean | null,
  delay = 0,
  coarsePointer = false,
) {
  if (reducedMotion) {
    return { duration: 0, delay: 0 };
  }

  const duration = coarsePointer ? 0.28 : 0.4;
  const scaledDelay = coarsePointer ? delay * 0.45 : delay;

  return { duration, delay: scaledDelay, ease: MOTION_EASE };
}
