export interface Counters {
  comparisons: number;
  swaps: number;
  visited: number;
}

/** A full snapshot of an array algorithm at one moment. Steps never share mutable state. */
export interface ArrayStep {
  kind: "array";
  values: number[];
  /** Stable identity of each value, so the UI can animate elements moving. */
  ids: number[];
  compare: number[];
  swap: number[];
  sorted: number[];
  range?: [number, number];
  mid?: number;
  found?: number;
  counters: Counters;
  beginner: string;
  technical: string;
}

export interface GraphStep {
  kind: "graph";
  current?: string;
  frontier: string[];
  visited: string[];
  dist?: Record<string, number>;
  activeEdge?: [string, string];
  path: string[];
  counters: Counters;
  beginner: string;
  technical: string;
}

export type Step = ArrayStep | GraphStep;

export interface GraphNode {
  id: string;
  x: number;
  y: number;
}
export interface GraphEdge {
  from: string;
  to: string;
  w: number;
}
export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
  }
}

export const zero = (): Counters => ({ comparisons: 0, swaps: 0, visited: 0 });
