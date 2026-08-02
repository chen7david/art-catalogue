import { Hono } from "hono";
import { auth } from "./routes/auth";
import { catalogueRoutes } from "./routes/catalogues";
import { pageRoutes } from "./routes/pages";
import type { Bindings } from "./env";

const app = new Hono<{ Bindings: Bindings }>()
  .get("/health", (c) => c.json({ status: "ok" }))
  .route("/auth", auth)
  .route("/catalogues", catalogueRoutes)
  .route("/", pageRoutes);

export default app;
export type AppType = typeof app;
