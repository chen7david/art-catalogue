import { useSetAtom } from "jotai";
import { sidebarOpenAtom } from "@/state/ui";

export function Topbar() {
  const setOpen = useSetAtom(sidebarOpenAtom);

  return (
    <header className="no-print flex items-center gap-3 border-b border-ink/10 bg-paper px-4 py-3 md:hidden">
      <button
        aria-label="Open sidebar"
        className="rounded-md p-2 text-ink hover:bg-ink/5"
        onClick={() => setOpen(true)}
      >
        <span className="block h-0.5 w-5 bg-ink mb-1" />
        <span className="block h-0.5 w-5 bg-ink mb-1" />
        <span className="block h-0.5 w-5 bg-ink" />
      </button>
      <span className="font-medium text-ink">Art Catalogue</span>
    </header>
  );
}
