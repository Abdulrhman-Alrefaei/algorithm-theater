import { describe, expect, it } from "vitest";
import { bubbleSort, insertionSort, selectionSort } from "./sorting";
import { binarySearch } from "./search";
import { bfs, dijkstra } from "./graph";
import { SAMPLE_GRAPHS, SAMPLE_ARRAYS, parseNumbers } from "./datasets";
import { InvalidInputError, type ArrayStep } from "./types";

const sorts = { bubbleSort, selectionSort, insertionSort };
const last = <T>(a: T[]): T => a[a.length - 1]!;

describe.each(Object.entries(sorts))("%s", (_, sort) => {
  it.each(SAMPLE_ARRAYS.map((s) => [s.label, s.values] as const))("sorts %s", (_l, values) => {
    const steps = sort(values);
    expect(last(steps).values).toEqual([...values].sort((a, b) => a - b));
  });
  it("handles random arrays incl. negatives and decimals", () => {
    for (let t = 0; t < 50; t++) {
      const arr = Array.from({ length: 12 }, () => Math.round((Math.random() - 0.5) * 200) / 2 + 0);
      expect(last(sort(arr)).values).toEqual([...arr].sort((a, b) => a - b));
    }
  });
  it("does not mutate input", () => {
    const arr = [3, 1, 2];
    sort(arr);
    expect(arr).toEqual([3, 1, 2]);
  });
  it("snapshots are independent (stepping back is exact)", () => {
    const steps = sort([4, 3, 2, 1]);
    const copy = JSON.parse(JSON.stringify(steps)) as ArrayStep[];
    expect(steps).toEqual(copy);
    expect(steps[0]!.values).toEqual([4, 3, 2, 1]);
    // ids remain a permutation and track values
    for (const s of steps) expect([...s.ids].sort()).toEqual([0, 1, 2, 3]);
  });
  it("counters never decrease", () => {
    const steps = sort([5, 1, 4, 2, 8]);
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i]!.counters.comparisons).toBeGreaterThanOrEqual(steps[i - 1]!.counters.comparisons);
      expect(steps[i]!.counters.swaps).toBeGreaterThanOrEqual(steps[i - 1]!.counters.swaps);
    }
  });
  it("rejects invalid input", () => {
    expect(() => sort([1, NaN])).toThrow(InvalidInputError);
    expect(() => sort("abc" as unknown as number[])).toThrow(InvalidInputError);
  });
});

describe("bubble sort specifics", () => {
  it("is O(n) on sorted input via early exit", () => {
    expect(last(bubbleSort([1, 2, 3, 4, 5])).counters).toMatchObject({ comparisons: 4, swaps: 0 });
  });
  it("reverse input requires n(n-1)/2 swaps", () => {
    expect(last(bubbleSort([5, 4, 3, 2, 1])).counters.swaps).toBe(10);
  });
});

describe("selection sort specifics", () => {
  it("always makes n(n-1)/2 comparisons", () => {
    expect(last(selectionSort([1, 2, 3, 4, 5])).counters.comparisons).toBe(10);
  });
});

describe("binarySearch", () => {
  const arr = [1, 3, 5, 7, 9, 11];
  it("finds every element", () => {
    arr.forEach((v, i) => expect(last(binarySearch(arr, v)).found).toBe(i));
  });
  it("reports missing values", () => {
    expect(last(binarySearch(arr, 4)).found).toBeUndefined();
    expect(last(binarySearch([], 4)).found).toBeUndefined();
  });
  it("uses at most floor(log2 n)+1 comparisons", () => {
    const big = Array.from({ length: 32 }, (_, i) => i);
    expect(last(binarySearch(big, 100)).counters.comparisons).toBeLessThanOrEqual(6);
  });
  it("works with duplicates", () => {
    const res = last(binarySearch([2, 2, 2, 3], 2)).found!;
    expect([2, 2, 2, 3][res]).toBe(2);
  });
  it("rejects unsorted input and bad targets", () => {
    expect(() => binarySearch([3, 1], 1)).toThrow(InvalidInputError);
    expect(() => binarySearch([1, 2], NaN)).toThrow(InvalidInputError);
  });
});

const city = SAMPLE_GRAPHS[0]!.graph;
const islands = SAMPLE_GRAPHS[2]!.graph;

describe("bfs", () => {
  it("finds fewest-hop path", () => {
    expect(last(bfs(city, "A", "F")).path).toHaveLength(4);
  });
  it("start equals target", () => {
    expect(last(bfs(city, "A", "A")).path).toEqual(["A"]);
  });
  it("unreachable target gives empty path", () => {
    expect(last(bfs(islands, "A", "E")).path).toEqual([]);
  });
  it("rejects unknown nodes", () => {
    expect(() => bfs(city, "A", "Z")).toThrow(InvalidInputError);
  });
});

describe("dijkstra", () => {
  it("finds lowest-cost path", () => {
    const s = last(dijkstra(city, "A", "F"));
    expect(s.path).toEqual(["A", "C", "B", "D", "E", "F"]);
    expect(s.dist!["F"]).toBe(12);
  });
  it("unreachable", () => {
    expect(last(dijkstra(islands, "A", "D")).path).toEqual([]);
  });
  it("rejects negative weights", () => {
    const g = { ...city, edges: [...city.edges, { from: "A", to: "F", w: -1 }] };
    expect(() => dijkstra(g, "A", "F")).toThrow(InvalidInputError);
  });
});

describe("parseNumbers", () => {
  it("parses and validates", () => {
    expect(parseNumbers("3, 1  2")).toEqual([3, 1, 2]);
    expect(parseNumbers("")).toEqual([]);
    expect(() => parseNumbers("1, x")).toThrow(InvalidInputError);
  });
});
