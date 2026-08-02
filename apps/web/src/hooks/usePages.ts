import { useMutation } from "@tanstack/react-query";
import type { CreatePageInput, UpdatePageInput } from "@art-catalogue/shared";
import { api } from "@/lib/api";
import { useInvalidateCatalogue } from "./useCatalogue";

export function useCreatePage(catalogueId: string) {
  const invalidate = useInvalidateCatalogue(catalogueId);
  return useMutation({
    mutationFn: async (input: CreatePageInput) => {
      const res = await api.catalogues[":catalogueId"].pages.$post({
        param: { catalogueId },
        json: input,
      });
      if (!res.ok) throw new Error("Failed to create page");
      return res.json();
    },
    onSuccess: invalidate,
  });
}

export function useUpdatePage(catalogueId: string) {
  const invalidate = useInvalidateCatalogue(catalogueId);
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdatePageInput }) => {
      const res = await api.pages[":id"].$patch({ param: { id }, json: input });
      if (!res.ok) throw new Error("Failed to update page");
      return res.json();
    },
    onSuccess: invalidate,
  });
}

export function useDeletePage(catalogueId: string) {
  const invalidate = useInvalidateCatalogue(catalogueId);
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.pages[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete page");
      return res.json();
    },
    onSuccess: invalidate,
  });
}

export function useReorderPages(catalogueId: string) {
  const invalidate = useInvalidateCatalogue(catalogueId);
  return useMutation({
    mutationFn: async (pageIds: string[]) => {
      const res = await api.catalogues[":catalogueId"].pages.reorder.$post({
        param: { catalogueId },
        json: { pageIds },
      });
      if (!res.ok) throw new Error("Failed to reorder pages");
      return res.json();
    },
    onSuccess: invalidate,
  });
}
