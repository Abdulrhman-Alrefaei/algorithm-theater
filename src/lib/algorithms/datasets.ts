import { InvalidInputError, type Graph } from "./types";

export const SAMPLE_ARRAYS: { label: string; values: number[] }[] = [
  { label: "Mixed", values: [42, 17, 8, 93, 25, 61, 4, 36] },
  { label: "Already sorted", values: [3, 9, 14, 22, 31, 47, 58, 70] },
  { label: "Reversed", values: [80, 68, 55, 41, 33, 20, 12, 5] },
  { label: "Duplicates", values: [5, 2, 8, 2, 5, 9, 2, 8] },
  { label: "Single item", values: [7] },
  { label: "Empty", values: [] },
];

export function parseNumbers(text: string): number[] {
  const parts = text.split(/[\s,]+/).filter(Boolean);
  if (parts.length > 40) throw new InvalidInputError("Please use 40 numbers or fewer.");
  return parts.map((p) => {
    const n = Number(p);
    if (!Number.isFinite(n)) throw new InvalidInputError(`"${p}" is not a number.`);
    if (Math.abs(n) > 999) throw new InvalidInputError("Keep numbers between -999 and 999.");
    return n;
  });
}

export function randomArray(n = 10): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 95) + 5);
}

export const SAMPLE_GRAPHS: { id: string; label: string; graph: Graph }[] = [
  {
    id: "city", label: "City map",
    graph: {
      nodes: [
        { id: "A", x: 70, y: 180 }, { id: "B", x: 200, y: 70 }, { id: "C", x: 200, y: 290 },
        { id: "D", x: 360, y: 70 }, { id: "E", x: 360, y: 290 }, { id: "F", x: 520, y: 180 },
      ],
      edges: [
        { from: "A", to: "B", w: 4 }, { from: "A", to: "C", w: 2 }, { from: "B", to: "C", w: 1 },
        { from: "B", to: "D", w: 5 }, { from: "C", to: "E", w: 10 }, { from: "D", to: "E", w: 2 },
        { from: "D", to: "F", w: 6 }, { from: "E", to: "F", w: 2 },
      ],
    },
  },
  {
    id: "network", label: "Network",
    graph: {
      nodes: [
        { id: "A", x: 60, y: 90 }, { id: "B", x: 190, y: 50 }, { id: "C", x: 330, y: 80 },
        { id: "D", x: 520, y: 60 }, { id: "E", x: 110, y: 270 }, { id: "F", x: 260, y: 210 },
        { id: "G", x: 400, y: 300 }, { id: "H", x: 540, y: 230 },
      ],
      edges: [
        { from: "A", to: "B", w: 2 }, { from: "A", to: "E", w: 7 }, { from: "B", to: "C", w: 3 },
        { from: "B", to: "F", w: 8 }, { from: "C", to: "D", w: 9 }, { from: "C", to: "F", w: 1 },
        { from: "E", to: "F", w: 2 }, { from: "F", to: "G", w: 3 }, { from: "G", to: "H", w: 2 },
        { from: "D", to: "H", w: 1 }, { from: "C", to: "G", w: 6 },
      ],
    },
  },
  {
    id: "islands", label: "Disconnected",
    graph: {
      nodes: [
        { id: "A", x: 80, y: 100 }, { id: "B", x: 220, y: 60 }, { id: "C", x: 160, y: 260 },
        { id: "D", x: 420, y: 120 }, { id: "E", x: 520, y: 280 },
      ],
      edges: [
        { from: "A", to: "B", w: 3 }, { from: "B", to: "C", w: 4 }, { from: "A", to: "C", w: 9 },
        { from: "D", to: "E", w: 2 },
      ],
    },
  },
];

export function randomizeWeights(g: Graph): Graph {
  return { nodes: g.nodes, edges: g.edges.map((e) => ({ ...e, w: Math.floor(Math.random() * 9) + 1 })) };
}
