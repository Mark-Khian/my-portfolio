export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

export function getRevealTransition(reducedMotion: boolean | null, delay = 0) {
  return reducedMotion
    ? { duration: 0, delay: 0 }
    : { duration: 0.55, delay, ease: MOTION_EASE };
}
