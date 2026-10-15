import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { ALGORITHMS, COMPLEXITY_CAVEAT, getAlgo } from "@/lib/algorithms/registry";
import { parseNumbers } from "@/lib/algorithms/datasets";
import { Header, ModeToggle } from "@/components/theater/Header";
import { InputPanel, initialInput, type InputState } from "@/components/theater/InputPanel";
import { Controls } from "@/components/theater/Controls";
import { CounterRow, Explanation, Legend, Stage, type Mode } from "@/components/theater/Stage";
import { usePlayer } from "@/components/theater/usePlayer";
import { runAlgo } from "@/components/theater/runInput";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Algorithm Theater by Abdulrahman Alrefaei — Watch algorithms run step by step" },
      { name: "description", content: "Interactive visualizations of sorting, binary search, BFS and Dijkstra with plain-language explanations." },
      { property: "og:title", content: "Algorithm Theater by Abdulrahman Alrefaei" },
      { property: "og:description", content: "Watch real algorithms execute step by step, forwards and backwards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Theater,
});

function Theater() {
  const [algoId, setAlgoId] = useState("bubble");
  const [mode, setMode] = useState<Mode>("beginner");
  const [input, setInput] = useState<InputState>(initialInput);
  const algo = getAlgo(algoId);
  const set = (p: Partial<InputState>) => setInput((s) => ({ ...s, ...p }));
  const result = useMemo(() => runAlgo(algo, input), [algo, input]);
  const p = usePlayer(result.steps.length, result.steps);
  const step = result.steps[p.index];

  const choose = (id: string) => {
    const next = getAlgo(id);
    if (next.category === "search") {
      try { set({ arrayText: parseNumbers(input.arrayText).sort((a, b) => a - b).join(", ") }); } catch { /* keep text; error shown */ }
    }
    setAlgoId(id);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <section className="panel p-4">
            <div className="label mb-3">Algorithm</div>
            <div className="space-y-1">
              {ALGORITHMS.map((a) => (
                <button key={a.id} onClick={() => choose(a.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${a.id === algoId ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                  {a.name}
                  <span className="font-mono text-[10px] uppercase opacity-60">{a.category}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="panel p-4">
            <InputPanel category={algo.category} s={input} set={set}
              onSortForSearch={() => { try { set({ arrayText: parseNumbers(input.arrayText).sort((a, b) => a - b).join(", ") }); } catch { /* invalid */ } }} />
          </section>
        </aside>

        <div className="min-w-0 space-y-4">
          <section className="panel p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{algo.name}</h1>
                <p className="text-sm text-muted-foreground">{algo.summary}</p>
              </div>
              <ModeToggle mode={mode} setMode={setMode} />
            </div>
            {result.error || !step ? (
              <div role="alert" className="flex h-[280px] flex-col items-center justify-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-6 text-center">
                <div className="font-semibold text-destructive">Can't run with this input</div>
                <div className="text-sm text-muted-foreground">{result.error}</div>
              </div>
            ) : (
              <>
                <Stage step={step} graph={input.graph} start={input.start} end={input.end} />
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                  <Legend category={algo.category} />
                  <CounterRow step={step} category={algo.category} />
                </div>
              </>
            )}
          </section>

          {step && (
            <>
              <section className="panel p-4"><Controls p={p} /></section>
              <section className="panel border-l-4 border-l-primary p-5">
                <div className="label mb-2">Step {p.index + 1} — {mode === "beginner" ? "what's happening" : "trace"}</div>
                <Explanation step={step} mode={mode} />
              </section>
            </>
          )}

          <section className="panel grid gap-5 p-5 md:grid-cols-2">
            <div>
              <div className="label mb-3">Time complexity</div>
              <dl className="grid grid-cols-4 gap-2 text-center">
                {(["best", "average", "worst", "space"] as const).map((k) => (
                  <div key={k} className="rounded-md bg-secondary p-2">
                    <dt className="text-[10px] uppercase text-muted-foreground">{k}</dt>
                    <dd className="font-mono text-sm text-primary">{algo.complexity[k]}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm text-muted-foreground">{algo.note}</p>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="label">A note on Big-O</div>
              <p>{COMPLEXITY_CAVEAT}</p>
              <a href={algo.reference.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                {algo.reference.label} <ExternalLink size={12} />
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
