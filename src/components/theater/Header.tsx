import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground">Aθ</span>
          <span className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">Algorithm Theater</span>
            <span className="text-[11px] font-medium text-muted-foreground">by Abdulrahman Alrefaei</span>
          </span>
        </Link>
        <nav className="flex gap-1 text-sm">
          <Link to="/" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>Theater</Link>
          <Link to="/compare" className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary" }}>Compare</Link>
        </nav>
      </div>
    </header>
  );
}

export function ModeToggle({ mode, setMode }: { mode: "beginner" | "technical"; setMode: (m: "beginner" | "technical") => void }) {
  return (
    <div className="inline-flex rounded-md border p-0.5">
      {(["beginner", "technical"] as const).map((m) => (
        <button key={m} onClick={() => setMode(m)}
          className={`rounded px-3 py-1 text-xs font-medium capitalize ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {m}
        </button>
      ))}
    </div>
  );
}
