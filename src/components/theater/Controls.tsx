import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { SPEEDS, type Player } from "./usePlayer";

export function Controls({ p }: { p: Player }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="btn" onClick={p.reset} aria-label="Reset"><RotateCcw size={16} /></button>
      <button className="btn" onClick={p.prev} disabled={p.index === 0} aria-label="Previous step"><SkipBack size={16} /></button>
      {p.playing ? (
        <button className="btn btn-primary min-w-24" onClick={p.pause}><Pause size={16} /> Pause</button>
      ) : (
        <button className="btn btn-primary min-w-24" onClick={p.play}><Play size={16} /> Play</button>
      )}
      <button className="btn" onClick={p.next} disabled={p.index >= p.last} aria-label="Next step"><SkipForward size={16} /></button>
      <input
        type="range" min={0} max={p.last} value={p.index}
        onChange={(e) => p.seek(Number(e.target.value))}
        className="mx-2 min-w-32 flex-1 accent-primary" aria-label="Timeline"
      />
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        {p.index + 1}/{p.last + 1}
      </span>
      <div className="flex items-center gap-1" role="group" aria-label="Speed">
        {SPEEDS.map((s) => (
          <button key={s} onClick={() => p.setSpeed(s)} className={`chip font-mono ${p.speed === s ? "chip-active" : ""}`}>
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}
