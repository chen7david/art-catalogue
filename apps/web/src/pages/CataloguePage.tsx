import { useParams } from "react-router-dom";

export function CataloguePage() {
  const { catalogueId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Catalogue</h1>
      <p className="mt-1 text-sm text-ink/60">ID: {catalogueId}</p>
    </div>
  );
}
