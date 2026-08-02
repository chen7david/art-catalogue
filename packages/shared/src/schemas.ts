import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
});

export const catalogueSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1).max(200),
  createdAt: z.string(),
});

export const pageTypeSchema = z.enum(["required", "general"]);

export const pageSchema = z.object({
  id: z.string(),
  catalogueId: z.string(),
  type: pageTypeSchema,
  slug: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  order: z.number().int(),
  imageWidth: z.number().int().positive().optional(),
  imageHeight: z.number().int().positive().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Catalogue = z.infer<typeof catalogueSchema>;
export type Page = z.infer<typeof pageSchema>;
