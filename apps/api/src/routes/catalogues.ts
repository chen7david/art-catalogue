import { Hono } from "hono";
import { and, asc, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createCatalogueSchema, updateCatalogueSchema } from "@art-catalogue/shared";
import { createDb } from "../db/client";
import { catalogues, pages } from "../db/schema";
import { requireAuth } from "../middleware/auth";
import { REQUIRED_PAGES } from "../lib/required-pages";
import type { Bindings } from "../env";

type Variables = { user: { id: string; email: string } };

const catalogueRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>()
  .use("*", requireAuth)
  .get("/", async (c) => {
    const db = createDb(c.env);
    const user = c.get("user");
    const rows = await db.select().from(catalogues).where(eq(catalogues.userId, user.id));
    return c.json(rows);
  })
  .post("/", zValidator("json", createCatalogueSchema), async (c) => {
    const db = createDb(c.env);
    const user = c.get("user");
    const { name } = c.req.valid("json");

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await db.insert(catalogues).values({ id, userId: user.id, name, createdAt });

    await db.insert(pages).values(
      REQUIRED_PAGES.map((p, index) => ({
        id: crypto.randomUUID(),
        catalogueId: id,
        type: "required" as const,
        slug: p.slug,
        title: p.title,
        sortOrder: index,
        createdAt,
      }))
    );

    return c.json({ id, userId: user.id, name, createdAt }, 201);
  })
  .get("/:id", async (c) => {
    const db = createDb(c.env);
    const user = c.get("user");
    const id = c.req.param("id");

    const [catalogue] = await db
      .select()
      .from(catalogues)
      .where(and(eq(catalogues.id, id), eq(catalogues.userId, user.id)))
      .limit(1);
    if (!catalogue) return c.json({ error: "Not found" }, 404);

    const catPages = await db
      .select()
      .from(pages)
      .where(eq(pages.catalogueId, id))
      .orderBy(asc(pages.sortOrder));

    return c.json({ ...catalogue, pages: catPages });
  })
  .patch("/:id", zValidator("json", updateCatalogueSchema), async (c) => {
    const db = createDb(c.env);
    const user = c.get("user");
    const id = c.req.param("id");
    const { name } = c.req.valid("json");

    const [existing] = await db
      .select()
      .from(catalogues)
      .where(and(eq(catalogues.id, id), eq(catalogues.userId, user.id)))
      .limit(1);
    if (!existing) return c.json({ error: "Not found" }, 404);

    await db.update(catalogues).set({ name }).where(eq(catalogues.id, id));
    return c.json({ ...existing, name });
  })
  .delete("/:id", async (c) => {
    const db = createDb(c.env);
    const user = c.get("user");
    const id = c.req.param("id");

    const [existing] = await db
      .select()
      .from(catalogues)
      .where(and(eq(catalogues.id, id), eq(catalogues.userId, user.id)))
      .limit(1);
    if (!existing) return c.json({ error: "Not found" }, 404);

    await db.delete(catalogues).where(eq(catalogues.id, id));
    return c.json({ ok: true });
  });

export { catalogueRoutes };
