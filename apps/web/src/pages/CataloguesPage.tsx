import { useCatalogues } from "@/hooks/useCatalogues";
import { CreateCatalogueDialog } from "@/components/catalogue/CreateCatalogueDialog";
import { CatalogueCard } from "@/components/catalogue/CatalogueCard";

export function CataloguesPage() {
  const { data: catalogues, isLoading } = useCatalogues();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your catalogues</h1>
          <p className="mt-1 text-sm text-ink/60">Create a new catalogue to get started.</p>
        </div>
        <CreateCatalogueDialog />
      </div>

      {isLoading && <p className="text-sm text-ink/50">Loading…</p>}

      {catalogues && catalogues.length === 0 && (
        <p className="text-sm text-ink/50">No catalogues yet. Create your first one above.</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {catalogues?.map((catalogue) => (
          <CatalogueCard key={catalogue.id} catalogue={catalogue} />
        ))}
      </div>
    </div>
  );
}
