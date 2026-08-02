import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createPageSchema, updatePageSchema, reorderPagesSchema } from "@art-catalogue/shared";
import { createDb } from "../db/client";
import { catalogues, pages } from "../db/schema";
import { requireAuth } from "../middleware/auth";
import type { Bindings } from "../env";

type Variables = { user: { id: string; email: string } };

async function assertOwnsCatalogue(db: ReturnType<typeof createDb>, catalogueId: string, userId: string) {
  const [catalogue] = await db
    .select()
    .from(catalogues)
    .where(and(eq(catalogues.id, catalogueId), eq(catalogues.userId, userId)))
    .limit(1);
  return catalogue;
}

const pageRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>()
  .use("*", requireAuth)
  .post("/catalogues/:catalogueId/pages", zValidator("json", createPageSchema), async (c) => {
    const db = createDb(c.env);
    const user = c.get("user");
    const catalogueId = c.req.param("catalogueId");
    const body = c.req.valid("json");

    const catalogue = await assertOwnsCatalogue(db, catalogueId, user.id);
    if (!catalogue) return c.json({ error: "Not found" }, 404);

    const existing = await db.select().from(pages).where(eq(pages.catalogueId, catalogueId));
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await db.insert(pages).values({
      id,
      catalogueId,
      type: "general",
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: body.title,
      description: body.description,
      body: body.body,
      imageWidth: body.imageWidth,
      imageHeight: body.imageHeight,
      sortOrder: existing.length,
      createdAt,
    });

    return c.json({ id, catalogueId, sortOrder: existing.length, createdAt, ...body }, 201);
  })
  .patch("/pages/:id", zValidator("json", updatePageSchema), async (c) => {
    const db = createDb(c.env);
    const user = c.get("user");
    const id = c.req.param("id");
    const body = c.req.valid("json");

    const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
    if (!page) return c.json({ error: "Not found" }, 404);
    const catalogue = await assertOwnsCatalogue(db, page.catalogueId, user.id);
    if (!catalogue) return c.json({ error: "Not found" }, 404);

    await db.update(pages).set(body).where(eq(pages.id, id));
    return c.json({ ...page, ...body });
  })
  .delete("/pages/:id", async (c) => {
    const db = createDb(c.env);
    const user = c.get("user");
    const id = c.req.param("id");

    const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
    if (!page) return c.json({ error: "Not found" }, 404);
    if (page.type === "required") return c.json({ error: "Required pages cannot be deleted" }, 400);

    const catalogue = await assertOwnsCatalogue(db, page.catalogueId, user.id);
    if (!catalogue) return c.json({ error: "Not found" }, 404);

    await db.delete(pages).where(eq(pages.id, id));
    return c.json({ ok: true });
  })
  .post(
    "/catalogues/:catalogueId/pages/reorder",
    zValidator("json", reorderPagesSchema),
    async (c) => {
      const db = createDb(c.env);
      const user = c.get("user");
      const catalogueId = c.req.param("catalogueId");
      const { pageIds } = c.req.valid("json");

      const catalogue = await assertOwnsCatalogue(db, catalogueId, user.id);
      if (!catalogue) return c.json({ error: "Not found" }, 404);

      await Promise.all(
        pageIds.map((id, index) =>
          db.update(pages).set({ sortOrder: index }).where(and(eq(pages.id, id), eq(pages.catalogueId, catalogueId)))
        )
      );

      return c.json({ ok: true });
    }
  );

export { pageRoutes };
