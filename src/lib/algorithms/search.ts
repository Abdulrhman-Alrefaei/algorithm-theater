import { validateArray } from "./sorting";
import { InvalidInputError, zero, type ArrayStep } from "./types";

export function binarySearch(input: number[], target: number): ArrayStep[] {
  const a = [...validateArray(input)];
  if (typeof target !== "number" || !Number.isFinite(target))
    throw new InvalidInputError("Target must be a finite number.");
  for (let i = 1; i < a.length; i++)
    if (a[i - 1]! > a[i]!) throw new InvalidInputError("Binary search needs the list sorted from smallest to largest.");

  const ids = a.map((_, i) => i);
  const c = zero();
  const steps: ArrayStep[] = [];
  const push = (beginner: string, technical: string, extra: Partial<ArrayStep> = {}) =>
    steps.push({
      kind: "array", values: a, ids, compare: [], swap: [], sorted: [],
      counters: { ...c }, beginner, technical, ...extra,
    });

  let lo = 0;
  let hi = a.length - 1;
  push(`We're looking for ${target}. Because the list is sorted, we can rule out half of it with each guess.`, `lo=0, hi=${hi}, target=${target}.`, a.length ? { range: [lo, hi] } : {});
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    c.comparisons++;
    c.visited++;
    push(`Check the middle item: ${a[mid]}.`, `mid = ⌊(${lo}+${hi})/2⌋ = ${mid}; compare a[${mid}]=${a[mid]} with ${target}.`, { range: [lo, hi], mid, compare: [mid] });
    if (a[mid] === target) {
      push(`Found ${target} at position ${mid + 1}!`, `a[${mid}] === target → return ${mid}.`, { range: [lo, hi], mid, found: mid });
      return steps;
    }
    if (a[mid]! < target) {
      lo = mid + 1;
      push(`${a[mid]} is too small, so ${target} can only be to the right.`, `a[mid] < target → lo = ${lo}.`, lo <= hi ? { range: [lo, hi] } : {});
    } else {
      hi = mid - 1;
      push(`${a[mid]} is too big, so ${target} can only be to the left.`, `a[mid] > target → hi = ${hi}.`, lo <= hi ? { range: [lo, hi] } : {});
    }
  }
  push(`${target} isn't in the list — there's nowhere left to look.`, `lo (${lo}) > hi (${hi}) → return -1.`);
  return steps;
}
