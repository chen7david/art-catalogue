import { useParams } from "react-router-dom";
import { useCatalogue } from "@/hooks/useCatalogue";
import { Button } from "@/components/ui/Button";

export function PrintCataloguePage() {
  const { catalogueId } = useParams<{ catalogueId: string }>();
  const { data: catalogue, isLoading } = useCatalogue(catalogueId);

  if (isLoading) return <p className="p-8 text-sm text-ink/50">Loading…</p>;
  if (!catalogue) return <p className="p-8 text-sm text-ink/50">Catalogue not found.</p>;

  return (
    <div className="mx-auto max-w-3xl bg-paper p-8 text-ink">
      <div className="no-print mb-6 flex justify-end">
        <Button onClick={() => window.print()}>Print</Button>
      </div>

      {catalogue.pages.map((page) => (
        <section key={page.id} className="mb-12 break-after-page">
          <h1 className="mb-1 text-3xl font-semibold tracking-tight">{page.title}</h1>
          {page.description && <p className="mb-4 text-ink/60">{page.description}</p>}
          {page.imageUrl && (
            <img
              src={page.imageUrl}
              alt={page.title}
              className="mb-4 w-full rounded-md object-contain"
            />
          )}
          {page.body && <p className="whitespace-pre-wrap leading-relaxed">{page.body}</p>}
        </section>
      ))}
    </div>
  );
}
