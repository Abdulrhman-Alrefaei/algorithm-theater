import type { Graph, Step } from "@/lib/algorithms/types";
import type { Category } from "@/lib/algorithms/registry";
import { ArrayView } from "./ArrayView";
import { GraphView } from "./GraphView";

export type Mode = "beginner" | "technical";

export function Stage({ step, graph, start, end }: { step: Step; graph: Graph; start: string; end: string }) {
  return step.kind === "array" ? <ArrayView step={step} /> : <GraphView step={step} graph={graph} start={start} end={end} />;
}

export function CounterRow({ step, category }: { step: Step; category: Category }) {
  const items =
    category === "sort"
      ? [["Comparisons", step.counters.comparisons], ["Swaps", step.counters.swaps]]
      : category === "search"
        ? [["Comparisons", step.counters.comparisons], ["Items checked", step.counters.visited]]
        : [["Visited nodes", step.counters.visited], ["Edges examined", step.counters.comparisons]];
  return (
    <div className="flex gap-6">
      {items.map(([k, v]) => (
        <div key={k as string}>
          <div className="label">{k}</div>
          <div className="font-mono text-2xl font-semibold tabular-nums text-primary">{v}</div>
        </div>
      ))}
    </div>
  );
}

export function Explanation({ step, mode }: { step: Step; mode: Mode }) {
  return (
    <p key={step.beginner + step.technical} className={`animate-in fade-in duration-300 ${mode === "technical" ? "font-mono text-sm" : "text-lg"} leading-relaxed`}>
      {mode === "beginner" ? step.beginner : step.technical}
    </p>
  );
}

export function Legend({ category }: { category: Category }) {
  const items: [string, string][] =
    category === "graph"
      ? [["var(--compare)", "Current"], ["var(--frontier)", "Waiting (dashed)"], ["var(--visited)", "Done"], ["var(--path)", "Path"]]
      : category === "search"
        ? [["var(--compare)", "Middle"], ["var(--muted)", "Ruled out"], ["var(--sorted)", "Found"]]
        : [["var(--compare)", "Comparing"], ["var(--swap)", "Swapping"], ["var(--sorted)", "In final place"]];
  return (
    <div className="flex flex-wrap gap-4">
      {items.map(([c, l]) => (
        <span key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} /> {l}
        </span>
      ))}
    </div>
  );
}
