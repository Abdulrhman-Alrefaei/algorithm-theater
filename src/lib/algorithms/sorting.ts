import { InvalidInputError, zero, type ArrayStep, type Counters } from "./types";

export function validateArray(input: unknown): number[] {
  if (!Array.isArray(input)) throw new InvalidInputError("Input must be an array of numbers.");
  input.forEach((v, i) => {
    if (typeof v !== "number" || !Number.isFinite(v))
      throw new InvalidInputError(`Item ${i + 1} is not a finite number.`);
  });
  return input as number[];
}

/** Small helper that records immutable snapshots of a working array. */
function recorder(input: number[]) {
  const values = [...input];
  const ids = values.map((_, i) => i);
  const c: Counters = zero();
  const sorted = new Set<number>();
  const steps: ArrayStep[] = [];
  const push = (
    beginner: string,
    technical: string,
    extra: Partial<Pick<ArrayStep, "compare" | "swap">> = {},
  ) =>
    steps.push({
      kind: "array",
      values: [...values],
      ids: [...ids],
      compare: extra.compare ?? [],
      swap: extra.swap ?? [],
      sorted: [...sorted].sort((a, b) => a - b),
      counters: { ...c },
      beginner,
      technical,
    });
  const swap = (i: number, j: number) => {
    const t = values[i]!; values[i] = values[j]!; values[j] = t;
    const u = ids[i]!; ids[i] = ids[j]!; ids[j] = u;
    c.swaps++;
  };
  return { values, c, sorted, steps, push, swap };
}

function emptyOrSingle(r: ReturnType<typeof recorder>): boolean {
  const n = r.values.length;
  if (n === 0) {
    r.push("There is nothing to sort — the list is empty.", "n = 0: the loop body never executes.");
    return true;
  }
  if (n === 1) {
    r.sorted.add(0);
    r.push("A list with one item is already sorted.", "n = 1: trivially sorted, 0 comparisons.");
    return true;
  }
  return false;
}

export function bubbleSort(input: number[]): ArrayStep[] {
  const r = recorder(validateArray(input));
  const { values: a, c, sorted, push, swap } = r;
  push("Here is the starting list. Bubble sort walks through it comparing neighbours.", `Initial array, n = ${a.length}.`);
  if (emptyOrSingle(r)) return r.steps;
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      c.comparisons++;
      push(
        `Compare ${a[j]} and ${a[j + 1]}. Is the left one bigger?`,
        `Pass ${i + 1}: compare a[${j}]=${a[j]} with a[${j + 1}]=${a[j + 1]}.`,
        { compare: [j, j + 1] },
      );
      if (a[j]! > a[j + 1]!) {
        swap(j, j + 1);
        swapped = true;
        push(
          `Yes — swap them so the bigger value moves right.`,
          `a[${j}] > a[${j + 1}] → swap. Array now [${a.join(", ")}].`,
          { swap: [j, j + 1] },
        );
      }
    }
    sorted.add(n - 1 - i);
    if (!swapped) {
      for (let k = 0; k < n; k++) sorted.add(k);
      push(
        "No swaps happened in this whole pass, so the list must already be in order. We can stop early.",
        `Pass ${i + 1} made 0 swaps → array is sorted; early termination.`,
      );
      return r.steps;
    }
    push(
      `${a[n - 1 - i]} has bubbled to its final spot.`,
      `End of pass ${i + 1}: a[${n - 1 - i}] is in final position.`,
    );
  }
  sorted.add(0);
  push("Every item is in place. The list is sorted!", `Sorted after ${c.comparisons} comparisons and ${c.swaps} swaps.`);
  return r.steps;
}

export function selectionSort(input: number[]): ArrayStep[] {
  const r = recorder(validateArray(input));
  const { values: a, c, sorted, push, swap } = r;
  push("Selection sort repeatedly finds the smallest remaining item and puts it next in line.", `Initial array, n = ${a.length}.`);
  if (emptyOrSingle(r)) return r.steps;
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      c.comparisons++;
      push(
        `Is ${a[j]} smaller than the smallest so far (${a[min]})?`,
        `i=${i}: compare a[${j}]=${a[j]} with current min a[${min}]=${a[min]}.`,
        { compare: [min, j] },
      );
      if (a[j]! < a[min]!) min = j;
    }
    if (min !== i) {
      swap(i, min);
      sorted.add(i);
      push(`Move ${a[i]}, the smallest remaining, into position ${i + 1}.`, `swap(a[${i}], a[${min}]).`, { swap: [i, min] });
    } else {
      sorted.add(i);
      push(`${a[i]} is already the smallest remaining — no move needed.`, `min index = i = ${i}; no swap.`);
    }
  }
  sorted.add(n - 1);
  push("The last item is automatically in place. Sorted!", `Sorted after ${c.comparisons} comparisons and ${c.swaps} swaps.`);
  return r.steps;
}

export function insertionSort(input: number[]): ArrayStep[] {
  const r = recorder(validateArray(input));
  const { values: a, c, sorted, push, swap } = r;
  push("Insertion sort grows a sorted section on the left, one card at a time.", `Initial array, n = ${a.length}.`);
  if (emptyOrSingle(r)) return r.steps;
  const n = a.length;
  sorted.add(0);
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      c.comparisons++;
      push(
        `Should ${a[j]} go before ${a[j - 1]}?`,
        `Insert key from index ${i}: compare a[${j - 1}]=${a[j - 1]} > a[${j}]=${a[j]}?`,
        { compare: [j - 1, j] },
      );
      if (a[j - 1]! > a[j]!) {
        swap(j - 1, j);
        push(`Yes — slide ${a[j - 1]} one step left.`, `Shift: swap a[${j - 1}], a[${j}].`, { swap: [j - 1, j] });
        j--;
      } else break;
    }
    for (let k = 0; k <= i; k++) sorted.add(k);
    push(`The first ${i + 1} items are now in order.`, `Prefix a[0..${i}] sorted.`);
  }
  push("All items inserted. Sorted!", `Sorted after ${c.comparisons} comparisons and ${c.swaps} swaps.`);
  return r.steps;
}
