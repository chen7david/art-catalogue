import { NavLink } from "react-router-dom";
import { useAtom } from "jotai";
import { sidebarOpenAtom } from "@/state/ui";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5"
  }`;

export function Sidebar() {
  const [open, setOpen] = useAtom(sidebarOpenAtom);

  return (
    <>
      {open && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink/10 bg-paper p-4 transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 px-2 text-lg font-semibold tracking-tight text-ink">
          Art Catalogue
        </div>
        <nav className="space-y-1">
          <NavLink to="/" end className={linkClasses}>
            Catalogues
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
