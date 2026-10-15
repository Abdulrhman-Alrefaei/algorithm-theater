import { bubbleSort, insertionSort, selectionSort } from "./sorting";
import { binarySearch } from "./search";
import { bfs, dijkstra } from "./graph";
import type { Graph, Step } from "./types";

export type Category = "sort" | "search" | "graph";

export interface AlgoInput {
  array: number[];
  target: number;
  graph: Graph;
  start: string;
  end: string;
}

export interface AlgoInfo {
  id: string;
  name: string;
  category: Category;
  summary: string;
  complexity: { best: string; average: string; worst: string; space: string };
  note: string;
  reference: { label: string; url: string };
  run: (i: AlgoInput) => Step[];
}

export const ALGORITHMS: AlgoInfo[] = [
  {
    id: "bubble", name: "Bubble Sort", category: "sort",
    summary: "Repeatedly swaps neighbouring items that are out of order.",
    complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    note: "Best case O(n) relies on early exit when a pass makes no swaps (already sorted input).",
    reference: { label: "Knuth, TAOCP Vol. 3 §5.2.2", url: "https://en.wikipedia.org/wiki/Bubble_sort" },
    run: (i) => bubbleSort(i.array),
  },
  {
    id: "selection", name: "Selection Sort", category: "sort",
    summary: "Finds the minimum of the unsorted part and moves it to the front.",
    complexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    note: "Always makes n(n−1)/2 comparisons, but at most n−1 swaps.",
    reference: { label: "CLRS, Exercise 2.2-2", url: "https://en.wikipedia.org/wiki/Selection_sort" },
    run: (i) => selectionSort(i.array),
  },
  {
    id: "insertion", name: "Insertion Sort", category: "sort",
    summary: "Builds a sorted prefix by inserting each item into place.",
    complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    note: "Very fast on nearly-sorted input; stable.",
    reference: { label: "CLRS, §2.1", url: "https://en.wikipedia.org/wiki/Insertion_sort" },
    run: (i) => insertionSort(i.array),
  },
  {
    id: "binary", name: "Binary Search", category: "search",
    summary: "Halves a sorted search range until the target is found or the range is empty.",
    complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)" },
    note: "Requires sorted input. Each comparison discards half the remaining items.",
    reference: { label: "Knuth, TAOCP Vol. 3 §6.2.1", url: "https://en.wikipedia.org/wiki/Binary_search_algorithm" },
    run: (i) => binarySearch(i.array, i.target),
  },
  {
    id: "bfs", name: "Breadth-First Search", category: "graph",
    summary: "Explores a graph level by level, finding the path with the fewest edges.",
    complexity: { best: "O(1)", average: "O(V + E)", worst: "O(V + E)", space: "O(V)" },
    note: "Ignores weights — shortest in hops, not in cost.",
    reference: { label: "CLRS, §20.2 (4th ed.)", url: "https://en.wikipedia.org/wiki/Breadth-first_search" },
    run: (i) => bfs(i.graph, i.start, i.end),
  },
  {
    id: "dijkstra", name: "Dijkstra's Shortest Path", category: "graph",
    summary: "Greedily finalises the closest unvisited node, giving lowest-cost paths.",
    complexity: { best: "O(V)", average: "O(V²)", worst: "O(V²)", space: "O(V)" },
    note: "This simple version scans for the minimum (O(V²)); a binary heap gives O((V+E) log V). Non-negative weights only.",
    reference: { label: "Dijkstra (1959), Numerische Mathematik 1", url: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm" },
    run: (i) => dijkstra(i.graph, i.start, i.end),
  },
];

export const getAlgo = (id: string): AlgoInfo => ALGORITHMS.find((a) => a.id === id) ?? ALGORITHMS[0]!;

export const COMPLEXITY_CAVEAT =
  "Big-O describes how work grows as input grows, ignoring constant factors. It doesn't predict exact runtimes: caches, memory layout, input shape, language and hardware all matter, and for small inputs an O(n²) algorithm can beat an O(n log n) one.";
