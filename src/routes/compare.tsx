import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ALGORITHMS, getAlgo, type Category } from "@/lib/algorithms/registry";
import { Header, ModeToggle } from "@/components/theater/Header";
import { InputPanel, initialInput, type InputState } from "@/components/theater/InputPanel";
import { Controls } from "@/components/theater/Controls";
import { CounterRow, Explanation, Legend, Stage, type Mode } from "@/components/theater/Stage";
import { usePlayer } from "@/components/theater/usePlayer";
import { runAlgo } from "@/components/theater/runInput";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare algorithms — Algorithm Theater by Abdulrahman Alrefaei" },
      { name: "description", content: "Run two algorithms side by side on the same input and compare their comparisons, swaps and visited nodes." },
      { property: "og:title", content: "Compare algorithms — Algorithm Theater by Abdulrahman Alrefaei" },
      { property: "og:description", content: "Side-by-side algorithm races on identical input." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Compare,
});

const GROUPS: { cat: Category; label: string; pair: [string, string] }[] = [
  { cat: "sort", label: "Sorting", pair: ["bubble", "insertion"] },
  { cat: "graph", label: "Graph paths", pair: ["bfs", "dijkstra"] },
];

function Compare() {
  const [cat, setCat] = useState<Category>("sort");
  const [pair, setPair] = useState<[string, string]>(["bubble", "insertion"]);
  const [mode, setMode] = useState<Mode>("beginner");
  const [input, setInput] = useState<InputState>(initialInput);
  const set = (p: Partial<InputState>) => setInput((s) => ({ ...s, ...p }));
  const algos = pair.map(getAlgo);
  const results = useMemo(() => algos.map((a) => runAlgo(a, input)), [pair, input]); // eslint-disable-line react-hooks/exhaustive-deps
  const longest = Math.max(...results.map((r) => r.steps.length), 1);
  const p = usePlayer(longest, results);
  const options = ALGORITHMS.filter((a) => a.category === cat);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl space-y-4 px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Compare side by side</h1>
            <p className="text-sm text-muted-foreground">Same input, one shared timeline. The one that finishes first stays on its final step.</p>
          </div>
          <div className="flex items-center gap-2">
            {GROUPS.map((g) => (
              <button key={g.cat} className={`chip ${cat === g.cat ? "chip-active" : ""}`} onClick={() => { setCat(g.cat); setPair(g.pair); }}>{g.label}</button>
            ))}
            <ModeToggle mode={mode} setMode={setMode} />
          </div>
        </div>

        <section className="panel p-4"><InputPanel category={cat} s={input} set={set} /></section>
        <section className="panel p-4"><Controls p={p} /></section>

        <div className="grid gap-4 lg:grid-cols-2">
          {algos.map((algo, side) => {
            const r = results[side]!;
            const step = r.steps[Math.min(p.index, r.steps.length - 1)];
            const done = p.index >= r.steps.length - 1;
            return (
              <section key={side} className="panel p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <select className="field w-auto" value={pair[side]}
                    onChange={(e) => setPair((pr) => (side === 0 ? [e.target.value, pr[1]] : [pr[0], e.target.value]))}>
                    {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <span className="font-mono text-xs text-muted-foreground">
                    {done ? `✓ finished in ${r.steps.length} steps` : `step ${p.index + 1}/${r.steps.length}`}
                  </span>
                </div>
                {r.error || !step ? (
                  <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-6 text-center text-sm text-destructive">{r.error}</div>
                ) : (
                  <>
                    <Stage step={step} graph={input.graph} start={input.start} end={input.end} />
                    <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                      <Legend category={cat} />
                      <CounterRow step={step} category={cat} />
                    </div>
                    <div className="mt-4 min-h-16 border-t pt-3"><Explanation step={step} mode={mode} /></div>
                  </>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
