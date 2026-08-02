import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const catalogueSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1).max(200),
  createdAt: z.string(),
});

export const createCatalogueSchema = z.object({
  name: z.string().min(1).max(200),
});

export const updateCatalogueSchema = z.object({
  name: z.string().min(1).max(200),
});

export const pageTypeSchema = z.enum(["required", "general"]);

export const pageSchema = z.object({
  id: z.string(),
  catalogueId: z.string(),
  type: pageTypeSchema,
  slug: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  body: z.string().max(20000).optional(),
  imageUrl: z.string().url().optional(),
  imageWidth: z.number().int().positive().optional(),
  imageHeight: z.number().int().positive().optional(),
  sortOrder: z.number().int(),
});

export const createPageSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  body: z.string().max(20000).optional(),
  imageWidth: z.number().int().positive().optional(),
  imageHeight: z.number().int().positive().optional(),
});

export const updatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  body: z.string().max(20000).optional(),
  imageUrl: z.string().url().optional(),
  imageWidth: z.number().int().positive().optional(),
  imageHeight: z.number().int().positive().optional(),
});

export const reorderPagesSchema = z.object({
  pageIds: z.array(z.string()).min(1),
});

export type User = z.infer<typeof userSchema>;
export type Catalogue = z.infer<typeof catalogueSchema>;
export type Page = z.infer<typeof pageSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateCatalogueInput = z.infer<typeof createCatalogueSchema>;
export type CreatePageInput = z.infer<typeof createPageSchema>;
