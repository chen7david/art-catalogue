import { Hono } from "hono";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { signupSchema, loginSchema } from "@art-catalogue/shared";
import { createDb } from "../db/client";
import { users, sessions } from "../db/schema";
import { hashPassword, verifyPassword } from "../lib/password";
import { requireAuth } from "../middleware/auth";
import type { Bindings } from "../env";

const SESSION_DAYS = 30;

function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    secure: true as const,
    sameSite: "Lax" as const,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

const auth = new Hono<{ Bindings: Bindings }>()
  .post("/signup", zValidator("json", signupSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const db = createDb(c.env);

    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) return c.json({ error: "Email already registered" }, 409);

    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    await db.insert(users).values({ id, email, passwordHash, createdAt: new Date().toISOString() });

    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    await db.insert(sessions).values({ id: sessionId, userId: id, expiresAt });

    setCookie(c, "session_id", sessionId, sessionCookieOptions());
    return c.json({ id, email }, 201);
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const db = createDb(c.env);

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    await db.insert(sessions).values({ id: sessionId, userId: user.id, expiresAt });

    setCookie(c, "session_id", sessionId, sessionCookieOptions());
    return c.json({ id: user.id, email: user.email });
  })
  .post("/logout", async (c) => {
    const sessionId = getCookie(c, "session_id");
    if (sessionId) {
      const db = createDb(c.env);
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    }
    deleteCookie(c, "session_id", { path: "/" });
    return c.json({ ok: true });
  })
  .get("/me", requireAuth, async (c) => {
    return c.json(c.get("user"));
  });

export { auth };
