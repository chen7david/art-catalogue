# Art Catalogue

A web app for creating printable art catalogues. Start a catalogue, fill in required pages (Preface, Introduction, Table of Contents), and add unlimited custom pages with title, description, images, and image dimensions.

## Stack

- Backend: Hono (target: Cloudflare Workers + D1)
- Frontend: React + Vite + Tailwind CSS
- API client: Hono RPC (`hc`) for end-to-end type safety
- Data fetching: TanStack Query
- State: Jotai
- Validation: Zod (shared package)
- ORM: Drizzle

## Monorepo Layout

```
apps/
  api/      Hono backend
  web/      React frontend
packages/
  shared/   Zod schemas + shared types
```

## Build Stages (tracked via feature branches + PRs)

0. Scaffold monorepo (this commit)
1. Shared Zod schemas
2. API backend: auth, Drizzle schema, catalogue/page CRUD
3. Frontend shell: sidebar layout, routing, TanStack Query + Jotai, Hono RPC client
4. Catalogue/page UI: create catalogue, page forms, image upload, add/delete/reorder
5. Print view: print-optimized layout for the full catalogue

## Development

```bash
pnpm install
pnpm dev
```
