import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
});

export const catalogues = sqliteTable("catalogues", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

export const pages = sqliteTable("pages", {
  id: text("id").primaryKey(),
  catalogueId: text("catalogue_id").notNull().references(() => catalogues.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["required", "general"] }).notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  body: text("body"),
  imageUrl: text("image_url"),
  imageWidth: integer("image_width"),
  imageHeight: integer("image_height"),
  sortOrder: integer("sort_order").notNull(),
  createdAt: text("created_at").notNull(),
});
