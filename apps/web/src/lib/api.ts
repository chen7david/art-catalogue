import { hc } from "hono/client";
import type { AppType } from "@art-catalogue/api";

export const api = hc<AppType>("/api");
