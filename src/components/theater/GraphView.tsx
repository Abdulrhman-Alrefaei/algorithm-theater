import type { Graph, GraphStep } from "@/lib/algorithms/types";

export function GraphView({ graph, step, start, end }: { graph: Graph; step: GraphStep; start: string; end: string }) {
  const pos = Object.fromEntries(graph.nodes.map((n) => [n.id, n]));
  const onPath = (a: string, b: string) => {
    const i = step.path.indexOf(a);
    return i >= 0 && (step.path[i + 1] === b || step.path[i - 1] === b);
  };
  const isActive = (a: string, b: string) =>
    !!step.activeEdge && ((step.activeEdge[0] === a && step.activeEdge[1] === b) || (step.activeEdge[0] === b && step.activeEdge[1] === a));

  const nodeFill = (id: string) => {
    if (step.path.includes(id)) return "var(--path)";
    if (step.current === id) return "var(--compare)";
    if (step.visited.includes(id) && !step.frontier.includes(id)) return "var(--visited)";
    if (step.frontier.includes(id)) return "var(--secondary)";
    return "var(--muted)";
  };

  return (
    <svg viewBox="0 0 600 360" className="h-auto w-full" role="img" aria-label="Graph visualization">
      {graph.edges.map((e) => {
        const a = pos[e.from]!, b = pos[e.to]!;
        const path = onPath(e.from, e.to);
        const active = isActive(e.from, e.to);
        return (
          <g key={`${e.from}-${e.to}`}>
            <line
              className="edge-line" x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={path ? "var(--path)" : active ? "var(--compare)" : "var(--border)"}
              strokeWidth={path ? 5 : active ? 4 : 2}
            />
            <g transform={`translate(${(a.x + b.x) / 2}, ${(a.y + b.y) / 2})`}>
              <rect x={-11} y={-10} width={22} height={20} rx={4} fill="var(--background)" stroke="var(--border)" />
              <text textAnchor="middle" dy={4} fontSize={11} className="font-mono" fill="var(--muted-foreground)">{e.w}</text>
            </g>
          </g>
        );
      })}
      {graph.nodes.map((n) => {
        const d = step.dist?.[n.id];
        return (
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
            {step.current === n.id && <circle r={22} fill="none" stroke="var(--compare)" strokeWidth={2} className="pulse" />}
            <circle
              className="node-circle" r={22} fill={nodeFill(n.id)}
              stroke={step.frontier.includes(n.id) ? "var(--frontier)" : n.id === start || n.id === end ? "var(--primary)" : "var(--border)"}
              strokeWidth={step.frontier.includes(n.id) ? 3 : 2}
              strokeDasharray={step.frontier.includes(n.id) ? "4 3" : undefined}
            />
            <text textAnchor="middle" dy={5} fontSize={15} fontWeight={700} fill={step.path.includes(n.id) || step.current === n.id ? "var(--primary-foreground)" : "var(--foreground)"}>
              {n.id}
            </text>
            {d !== undefined && (
              <text textAnchor="middle" y={40} fontSize={11} className="font-mono" fill="var(--compare)">
                {d === Infinity ? "∞" : d}
              </text>
            )}
            {(n.id === start || n.id === end) && (
              <text textAnchor="middle" y={-30} fontSize={10} className="font-mono" fill="var(--primary)">
                {n.id === start ? "START" : "TARGET"}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
