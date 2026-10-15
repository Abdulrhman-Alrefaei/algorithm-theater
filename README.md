# Algorithm Theater

**An interactive algorithm visualization lab by Abdulrahman Alrefaei.**

Algorithm Theater helps learners explore how common algorithms work by stepping through their execution, inspecting state changes, and comparing performance characteristics.

## Features

- Visualize Bubble Sort, Selection Sort, Insertion Sort, Binary Search, Breadth-First Search (BFS), and Dijkstra's shortest-path algorithm.
- Use sample inputs or build custom arrays and graphs.
- Play, pause, step forward and backward, reset, scrub the timeline, and adjust playback speed.
- Switch between beginner-friendly explanations and technical traces.
- Track comparisons, swaps, visited nodes, and examined edges.
- Compare two algorithms on the same input with a shared timeline.
- Review best, average, worst-case, and space complexity notes.

## Technology

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite and Nitro
- Tailwind CSS 4
- Vitest for tests

## Run locally

Prerequisites: Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

The development server prints the local URL after it starts.

## Check before deployment

```bash
npm test
npm run build
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) with your GitHub account.
3. Select **Add New → Project** and import this repository.
4. Keep the detected **TanStack Start** framework settings and select **Deploy**.
5. Once deployment succeeds, use the Vercel URL to open and test both the main page and the **Compare** page.

The included `vercel.json` makes the intended framework explicit. New commits pushed to the connected GitHub branch can trigger new deployments automatically.

## Project structure

- `src/components/theater/` — visualization interface and playback controls
- `src/lib/algorithms/` — algorithm implementations, datasets, and registry
- `src/routes/index.tsx` — main interactive theater
- `src/routes/compare.tsx` — side-by-side algorithm comparison
- `src/test/` — application routing test setup

Each algorithm produces immutable snapshots of its execution. The interface displays those snapshots, which allows users to move forward and backward through the algorithm's steps.

## References

- Knuth, *The Art of Computer Programming*, Volume 3.
- Cormen, Leiserson, Rivest, and Stein, *Introduction to Algorithms*.
- E. W. Dijkstra, “A note on two problems in connexion with graphs,” *Numerische Mathematik*, 1 (1959).

## Author

**Abdulrahman Alrefaei** — Computer Science student.
