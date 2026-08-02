import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCatalogue } from "@/hooks/useCatalogue";
import { useCreatePage, useDeletePage, useReorderPages, useUpdatePage } from "@/hooks/usePages";
import { PageNav } from "@/components/catalogue/PageNav";
import { PageForm } from "@/components/catalogue/PageForm";
import { Button } from "@/components/ui/Button";

export function CataloguePage() {
  const { catalogueId } = useParams<{ catalogueId: string }>();
  const { data: catalogue, isLoading } = useCatalogue(catalogueId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);

  const createPage = useCreatePage(catalogueId ?? "");
  const updatePage = useUpdatePage(catalogueId ?? "");
  const deletePage = useDeletePage(catalogueId ?? "");
  const reorderPages = useReorderPages(catalogueId ?? "");

  const pages = catalogue?.pages ?? [];
  const activeId = creatingNew ? null : (selectedId ?? pages[0]?.id ?? null);
  const activePage = useMemo(() => pages.find((p) => p.id === activeId) ?? null, [pages, activeId]);

  async function handleMove(id: string, direction: "up" | "down") {
    const requiredIds = pages.filter((p) => p.type === "required").map((p) => p.id);
    const generalPages = pages.filter((p) => p.type === "general");
    const index = generalPages.findIndex((p) => p.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= generalPages.length) return;

    const reordered = [...generalPages];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    await reorderPages.mutateAsync([...requiredIds, ...reordered.map((p) => p.id)]);
  }

  async function handleDelete(id: string) {
    await deletePage.mutateAsync(id);
    if (selectedId === id) setSelectedId(null);
  }

  if (isLoading) return <p className="text-sm text-ink/50">Loading…</p>;
  if (!catalogue) return <p className="text-sm text-ink/50">Catalogue not found.</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/" className="text-xs text-ink/50 hover:underline">
            ← Catalogues
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{catalogue.name}</h1>
        </div>
        <Link to={`/catalogues/${catalogue.id}/print`}>
          <Button variant="secondary">Print view</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <PageNav
          pages={pages}
          selectedId={activeId}
          onSelect={(id) => {
            setSelectedId(id);
            setCreatingNew(false);
          }}
          onAdd={() => setCreatingNew(true)}
          onDelete={handleDelete}
          onMove={handleMove}
        />

        <div className="rounded-lg border border-ink/10 p-6">
          {creatingNew ? (
            <PageForm
              page={null}
              isNew
              isSaving={createPage.isPending}
              onSubmit={async (values) => {
                const created = await createPage.mutateAsync(values);
                setCreatingNew(false);
                setSelectedId(created.id);
              }}
            />
          ) : activePage ? (
            <PageForm
              key={activePage.id}
              page={activePage}
              isNew={false}
              isSaving={updatePage.isPending}
              onSubmit={async (values) => {
                await updatePage.mutateAsync({ id: activePage.id, input: values });
              }}
            />
          ) : (
            <p className="text-sm text-ink/50">Select a page or add a new one to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}
