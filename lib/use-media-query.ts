"use client";

import { useSyncExternalStore } from "react";

function subscribeToMediaQuery(query: string, callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getMediaQuerySnapshot(query: string) {
  return window.matchMedia(query).matches;
}

function getMediaQueryServerSnapshot() {
  return false;
}

/** Shared matchMedia subscription — safe to call from many components. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => subscribeToMediaQuery(query, callback),
    () => getMediaQuerySnapshot(query),
    getMediaQueryServerSnapshot,
  );
}

export function useCoarsePointer() {
  return useMediaQuery("(pointer: coarse)");
}

export function useFineHover() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
