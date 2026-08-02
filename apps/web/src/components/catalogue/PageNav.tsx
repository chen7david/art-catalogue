import type { Page } from "@art-catalogue/shared";
import { Button } from "@/components/ui/Button";

interface PageNavProps {
  pages: Page[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

export function PageNav({ pages, selectedId, onSelect, onAdd, onDelete, onMove }: PageNavProps) {
  const requiredPages = pages.filter((p) => p.type === "required");
  const generalPages = pages.filter((p) => p.type === "general");

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink/40">
          Required pages
        </p>
        <ul className="space-y-1">
          {requiredPages.map((page) => (
            <li key={page.id}>
              <button
                onClick={() => onSelect(page.id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                  selectedId === page.id ? "bg-ink text-paper" : "text-ink/80 hover:bg-ink/5"
                }`}
              >
                {page.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Pages</p>
          <Button variant="ghost" className="px-2 py-1 text-xs" onClick={onAdd}>
            + Add page
          </Button>
        </div>
        <ul className="space-y-1">
          {generalPages.map((page, index) => (
            <li key={page.id} className="group flex items-center gap-1">
              <button
                onClick={() => onSelect(page.id)}
                className={`flex-1 rounded-md px-3 py-2 text-left text-sm ${
                  selectedId === page.id ? "bg-ink text-paper" : "text-ink/80 hover:bg-ink/5"
                }`}
              >
                {page.title}
              </button>
              <div className="hidden gap-0.5 group-hover:flex">
                <button
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => onMove(page.id, "up")}
                  className="rounded px-1 text-xs text-ink/50 hover:bg-ink/10 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  aria-label="Move down"
                  disabled={index === generalPages.length - 1}
                  onClick={() => onMove(page.id, "down")}
                  className="rounded px-1 text-xs text-ink/50 hover:bg-ink/10 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  aria-label="Delete page"
                  onClick={() => onDelete(page.id)}
                  className="rounded px-1 text-xs text-red-500 hover:bg-red-50"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
          {generalPages.length === 0 && (
            <li className="px-3 py-2 text-xs text-ink/40">No pages yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
