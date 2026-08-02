import { Link } from "react-router-dom";
import type { Catalogue } from "@art-catalogue/shared";

export function CatalogueCard({ catalogue }: { catalogue: Catalogue }) {
  return (
    <Link
      to={`/catalogues/${catalogue.id}`}
      className="block rounded-lg border border-ink/10 p-4 transition-colors hover:border-ink/30"
    >
      <h3 className="font-medium text-ink">{catalogue.name}</h3>
      <p className="mt-1 text-xs text-ink/50">
        Created {new Date(catalogue.createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
