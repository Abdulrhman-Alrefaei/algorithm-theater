import type { ArrayStep } from "@/lib/algorithms/types";

const W = 640;
const H = 280;

export function ArrayView({ step }: { step: ArrayStep }) {
  const n = step.values.length;
  if (n === 0)
    return (
      <div className="flex h-[280px] items-center justify-center font-mono text-sm text-muted-foreground">
        [ ] — empty array
      </div>
    );
  const max = Math.max(...step.values.map(Math.abs), 1);
  const slot = W / n;
  const bw = Math.max(4, slot * 0.72);
  const showLabels = n <= 24;
  // map each element id to its current position so bars glide when swapped
  const order = step.ids.map((id, pos) => ({ id, pos, v: step.values[pos] })).sort((a, b) => a.id - b.id);

  const fill = (pos: number) => {
    if (step.found === pos) return "var(--sorted)";
    if (step.swap.includes(pos)) return "var(--swap)";
    if (step.compare.includes(pos)) return "var(--compare)";
    if (step.sorted.includes(pos)) return "var(--sorted)";
    if (step.range && (pos < step.range[0] || pos > step.range[1])) return "var(--muted)";
    return "var(--bar)";
  };

  return (
    <svg viewBox={`0 0 ${W} ${H + 40}`} className="h-auto w-full" role="img" aria-label={`Array: ${step.values.join(", ")}`}>
      {step.range && (
        <rect
          x={step.range[0] * slot + 2} y={4} width={(step.range[1] - step.range[0] + 1) * slot - 4} height={H - 4}
          rx={6} fill="none" stroke="var(--primary)" strokeOpacity={0.4} strokeDasharray="4 4"
        />
      )}
      {order.map(({ id, pos, v }) => {
        const h = Math.max(4, (Math.abs(v ?? 0) / max) * (H - 30));
        return (
          <g key={id} className="bar-group" style={{ transform: `translateX(${pos * slot + (slot - bw) / 2}px)` }}>
            <rect className="bar-rect" x={0} y={H - h} width={bw} height={h} rx={3} fill={fill(pos)} />
            {showLabels && (
              <text x={bw / 2} y={H + 18} textAnchor="middle" className="font-mono" fontSize={12} fill="var(--foreground)">
                {v}
              </text>
            )}
          </g>
        );
      })}
      {step.mid !== undefined && (
        <text x={step.mid * slot + slot / 2} y={H + 36} textAnchor="middle" fontSize={11} className="font-mono" fill="var(--compare)">
          ▲ mid
        </text>
      )}
    </svg>
  );
}
