import { parseNumbers } from "@/lib/algorithms/datasets";
import type { AlgoInfo } from "@/lib/algorithms/registry";
import type { Step } from "@/lib/algorithms/types";
import type { InputState } from "./InputPanel";

export function runAlgo(algo: AlgoInfo, s: InputState): { steps: Step[]; error?: string } {
  try {
    const array = algo.category === "graph" ? [] : parseNumbers(s.arrayText);
    const target = algo.category === "search" ? (s.targetText.trim() === "" ? NaN : Number(s.targetText)) : 0;
    return { steps: algo.run({ array, target, graph: s.graph, start: s.start, end: s.end }) };
  } catch (e) {
    return { steps: [], error: e instanceof Error ? e.message : String(e) };
  }
}
