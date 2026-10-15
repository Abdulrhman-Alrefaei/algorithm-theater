import { Shuffle } from "lucide-react";
import { SAMPLE_ARRAYS, SAMPLE_GRAPHS, randomArray, randomizeWeights } from "@/lib/algorithms/datasets";
import type { Category } from "@/lib/algorithms/registry";
import type { Graph } from "@/lib/algorithms/types";

export interface InputState {
  arrayText: string;
  targetText: string;
  graphId: string;
  graph: Graph;
  start: string;
  end: string;
}

export const initialInput = (): InputState => ({
  arrayText: SAMPLE_ARRAYS[0]!.values.join(", "),
  targetText: "25",
  graphId: SAMPLE_GRAPHS[0]!.id,
  graph: SAMPLE_GRAPHS[0]!.graph,
  start: "A",
  end: "F",
});

export function InputPanel({ category, s, set, onSortForSearch }: {
  category: Category;
  s: InputState;
  set: (p: Partial<InputState>) => void;
  onSortForSearch?: () => void;
}) {
  if (category === "graph") {
    const ids = s.graph.nodes.map((n) => n.id);
    return (
      <div className="space-y-3">
        <div className="label">Graph</div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_GRAPHS.map((g) => (
            <button key={g.id} className={`chip ${s.graphId === g.id ? "chip-active" : ""}`}
              onClick={() => set({ graphId: g.id, graph: g.graph, start: g.graph.nodes[0]!.id, end: g.graph.nodes[g.graph.nodes.length - 1]!.id })}>
              {g.label}
            </button>
          ))}
          <button className="chip" onClick={() => set({ graph: randomizeWeights(s.graph) })}><Shuffle size={12} className="mr-1 inline" />Random weights</button>
        </div>
        <div className="flex gap-3">
          {(["start", "end"] as const).map((k) => (
            <label key={k} className="flex-1">
              <span className="label">{k === "start" ? "Start" : "Target"}</span>
              <select className="field mt-1" value={s[k]} onChange={(e) => set({ [k]: e.target.value })}>
                {ids.map((id) => <option key={id}>{id}</option>)}
              </select>
            </label>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="label">Numbers (comma or space separated)</span>
        <textarea className="field mt-1 h-20 resize-none" value={s.arrayText} onChange={(e) => set({ arrayText: e.target.value })} />
      </label>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_ARRAYS.map((d) => (
          <button key={d.label} className="chip"
            onClick={() => set({ arrayText: (category === "search" ? [...d.values].sort((a, b) => a - b) : d.values).join(", ") })}>
            {d.label}
          </button>
        ))}
        <button className="chip" onClick={() => {
          const a = randomArray(10);
          set({ arrayText: (category === "search" ? a.sort((x, y) => x - y) : a).join(", ") });
        }}><Shuffle size={12} className="mr-1 inline" />Random</button>
      </div>
      {category === "search" && (
        <div className="flex items-end gap-2">
          <label className="flex-1">
            <span className="label">Target</span>
            <input className="field mt-1" value={s.targetText} onChange={(e) => set({ targetText: e.target.value })} />
          </label>
          {onSortForSearch && <button className="btn" onClick={onSortForSearch}>Sort list</button>}
        </div>
      )}
    </div>
  );
}
