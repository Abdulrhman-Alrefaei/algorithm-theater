import { useEffect, useState } from "react";

export const SPEEDS = [0.5, 1, 2, 4, 8];

/** Drives an index through a fixed list of precomputed steps. `resetKey` restarts playback. */
export function usePlayer(length: number, resetKey: unknown) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [resetKey]);

  useEffect(() => {
    if (!playing) return;
    if (index >= length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setIndex((i) => Math.min(i + 1, length - 1)), 1000 / speed);
    return () => clearTimeout(t);
  }, [playing, index, length, speed]);

  const last = Math.max(0, length - 1);
  return {
    index: Math.min(index, last),
    last,
    playing,
    speed,
    setSpeed,
    play: () => {
      if (index >= last) setIndex(0);
      setPlaying(true);
    },
    pause: () => setPlaying(false),
    next: () => { setPlaying(false); setIndex((i) => Math.min(i + 1, last)); },
    prev: () => { setPlaying(false); setIndex((i) => Math.max(i - 1, 0)); },
    reset: () => { setPlaying(false); setIndex(0); },
    seek: (i: number) => { setPlaying(false); setIndex(i); },
  };
}
export type Player = ReturnType<typeof usePlayer>;
