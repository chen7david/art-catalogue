import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import { createDb } from "../db/client";
import { sessions, users } from "../db/schema";
import type { Bindings } from "../env";

type Variables = {
  user: { id: string; email: string };
};

export const requireAuth = createMiddleware<{ Bindings: Bindings; Variables: Variables }>(
  async (c, next) => {
    const sessionId = getCookie(c, "session_id");
    if (!sessionId) return c.json({ error: "Unauthorized" }, 401);

    const db = createDb(c.env);
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (!session || new Date(session.expiresAt) < new Date()) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    c.set("user", { id: user.id, email: user.email });
    await next();
  }
);
