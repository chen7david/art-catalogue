export const queryKeys = {
  catalogues: ["catalogues"] as const,
  catalogue: (id: string) => ["catalogues", id] as const,
};
