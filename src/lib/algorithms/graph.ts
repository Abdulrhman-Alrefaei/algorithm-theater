import { InvalidInputError, zero, type Graph, type GraphStep } from "./types";

function validate(g: Graph, start: string, target: string) {
  if (!g || !Array.isArray(g.nodes) || !Array.isArray(g.edges)) throw new InvalidInputError("Graph is malformed.");
  const ids = new Set(g.nodes.map((n) => n.id));
  if (!ids.has(start)) throw new InvalidInputError(`Start node "${start}" is not in the graph.`);
  if (!ids.has(target)) throw new InvalidInputError(`Target node "${target}" is not in the graph.`);
  for (const e of g.edges) {
    if (!ids.has(e.from) || !ids.has(e.to)) throw new InvalidInputError("An edge references a missing node.");
    if (!Number.isFinite(e.w)) throw new InvalidInputError("Edge weights must be finite numbers.");
  }
}

/** Undirected adjacency list, neighbours in alphabetical order for deterministic runs. */
export function adjacency(g: Graph) {
  const adj = new Map<string, { to: string; w: number }[]>();
  g.nodes.forEach((n) => adj.set(n.id, []));
  for (const e of g.edges) {
    adj.get(e.from)!.push({ to: e.to, w: e.w });
    adj.get(e.to)!.push({ to: e.from, w: e.w });
  }
  adj.forEach((l) => l.sort((a, b) => a.to.localeCompare(b.to)));
  return adj;
}

function buildPath(parent: Map<string, string>, start: string, target: string): string[] {
  if (start === target) return [start];
  if (!parent.has(target)) return [];
  const p = [target];
  let cur = target;
  while (cur !== start) {
    cur = parent.get(cur)!;
    p.unshift(cur);
  }
  return p;
}

export function bfs(g: Graph, start: string, target: string): GraphStep[] {
  validate(g, start, target);
  const adj = adjacency(g);
  const c = zero();
  const steps: GraphStep[] = [];
  const visited = new Set<string>([start]);
  const parent = new Map<string, string>();
  const queue = [start];
  const push = (beginner: string, technical: string, extra: Partial<GraphStep> = {}) =>
    steps.push({ kind: "graph", frontier: [...queue], visited: [...visited], path: [], counters: { ...c }, beginner, technical, ...extra });

  push(`Start at ${start}. BFS explores in rings: all neighbours first, then their neighbours.`, `queue = [${start}], visited = {${start}}.`);
  while (queue.length) {
    const cur = queue.shift()!;
    c.visited++;
    push(`Visit ${cur}.`, `dequeue ${cur}.`, { current: cur });
    if (cur === target) {
      const path = buildPath(parent, start, target);
      push(`Reached ${target}! The route with the fewest hops is ${path.join(" → ")}.`, `target dequeued; path length ${path.length - 1} edges (weights ignored).`, { current: cur, path });
      return steps;
    }
    for (const { to } of adj.get(cur)!) {
      c.comparisons++;
      if (!visited.has(to)) {
        visited.add(to);
        parent.set(to, cur);
        queue.push(to);
        push(`${to} is new — add it to the waiting line.`, `enqueue ${to}, parent[${to}] = ${cur}.`, { current: cur, activeEdge: [cur, to] });
      }
    }
  }
  push(`${target} can't be reached from ${start}.`, `queue empty; no path.`);
  return steps;
}

export function dijkstra(g: Graph, start: string, target: string): GraphStep[] {
  validate(g, start, target);
  if (g.edges.some((e) => e.w < 0)) throw new InvalidInputError("Dijkstra's algorithm requires non-negative edge weights.");
  const adj = adjacency(g);
  const c = zero();
  const steps: GraphStep[] = [];
  const dist: Record<string, number> = {};
  g.nodes.forEach((n) => (dist[n.id] = Infinity));
  dist[start] = 0;
  const done = new Set<string>();
  const parent = new Map<string, string>();
  const frontier = () => g.nodes.map((n) => n.id).filter((id) => !done.has(id) && dist[id]! < Infinity);
  const push = (beginner: string, technical: string, extra: Partial<GraphStep> = {}) =>
    steps.push({ kind: "graph", frontier: frontier(), visited: [...done], dist: { ...dist }, path: [], counters: { ...c }, beginner, technical, ...extra });

  push(`Start at ${start} with distance 0. Every other place starts as "unknown" (∞).`, `dist[${start}] = 0, all others ∞.`);
  for (;;) {
    let cur: string | undefined;
    for (const id of frontier()) {
      if (cur === undefined || dist[id]! < dist[cur]!) cur = id;
    }
    if (cur === undefined) break;
    done.add(cur);
    c.visited++;
    push(`${cur} is the closest unfinished place (${dist[cur]}). Its distance is now final.`, `extract-min → ${cur}, dist = ${dist[cur]}.`, { current: cur });
    if (cur === target) break;
    for (const { to, w } of adj.get(cur)!) {
      if (done.has(to)) continue;
      c.comparisons++;
      const nd = dist[cur]! + w;
      if (nd < dist[to]!) {
        const old = dist[to];
        dist[to] = nd;
        parent.set(to, cur);
        push(`Going through ${cur} reaches ${to} in ${nd}, better than ${old === Infinity ? "unknown" : old}.`, `relax (${cur},${to}): ${dist[cur]}+${w}=${nd} < ${old === Infinity ? "∞" : old} → update.`, { current: cur, activeEdge: [cur, to] });
      } else {
        push(`Going through ${cur} to ${to} costs ${nd} — no better than ${dist[to]}.`, `relax (${cur},${to}): ${nd} ≥ ${dist[to]} → skip.`, { current: cur, activeEdge: [cur, to] });
      }
    }
  }
  const path = buildPath(parent, start, target);
  if (path.length)
    push(`Shortest route: ${path.join(" → ")} with total cost ${dist[target]}.`, `path via parent pointers; cost ${dist[target]}.`, { path, current: target });
  else push(`${target} can't be reached from ${start}.`, `dist[${target}] = ∞.`);
  return steps;
}
