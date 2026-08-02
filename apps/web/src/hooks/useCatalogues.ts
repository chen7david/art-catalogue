import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCatalogueInput } from "@art-catalogue/shared";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export function useCatalogues() {
  return useQuery({
    queryKey: queryKeys.catalogues,
    queryFn: async () => {
      const res = await api.catalogues.$get();
      if (!res.ok) throw new Error("Failed to load catalogues");
      return res.json();
    },
  });
}

export function useCreateCatalogue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCatalogueInput) => {
      const res = await api.catalogues.$post({ json: input });
      if (!res.ok) throw new Error("Failed to create catalogue");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalogues });
    },
  });
}

export function useDeleteCatalogue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.catalogues[":id"].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete catalogue");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.catalogues });
    },
  });
}
