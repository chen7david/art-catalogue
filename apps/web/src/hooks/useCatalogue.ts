import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export function useCatalogue(catalogueId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.catalogue(catalogueId ?? ""),
    queryFn: async () => {
      const res = await api.catalogues[":id"].$get({ param: { id: catalogueId! } });
      if (!res.ok) throw new Error("Failed to load catalogue");
      return res.json();
    },
    enabled: Boolean(catalogueId),
  });
}

export function useInvalidateCatalogue(catalogueId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.catalogue(catalogueId) });
}
