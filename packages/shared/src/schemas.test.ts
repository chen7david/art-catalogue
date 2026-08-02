import { describe, expect, it } from "vitest";
import {
  createCatalogueSchema,
  createPageSchema,
  loginSchema,
  pageSchema,
  reorderPagesSchema,
  signupSchema,
} from "./schemas";

describe("signupSchema", () => {
  it("accepts a valid email and password", () => {
    const result = signupSchema.safeParse({ email: "a@b.com", password: "password123" });
    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = signupSchema.safeParse({ email: "a@b.com", password: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({ email: "not-an-email", password: "password123" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a non-empty password", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("createCatalogueSchema", () => {
  it("rejects an empty name", () => {
    const result = createCatalogueSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid name", () => {
    const result = createCatalogueSchema.safeParse({ name: "My Collection" });
    expect(result.success).toBe(true);
  });
});

describe("pageSchema", () => {
  it("accepts a required page with minimal fields", () => {
    const result = pageSchema.safeParse({
      id: "1",
      catalogueId: "c1",
      type: "required",
      slug: "preface",
      title: "Preface",
      sortOrder: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid page type", () => {
    const result = pageSchema.safeParse({
      id: "1",
      catalogueId: "c1",
      type: "invalid",
      slug: "preface",
      title: "Preface",
      sortOrder: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("createPageSchema", () => {
  it("accepts optional image dimensions", () => {
    const result = createPageSchema.safeParse({
      title: "Artwork 1",
      imageWidth: 800,
      imageHeight: 600,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative image dimensions", () => {
    const result = createPageSchema.safeParse({ title: "Artwork 1", imageWidth: -1 });
    expect(result.success).toBe(false);
  });
});

describe("reorderPagesSchema", () => {
  it("requires at least one page id", () => {
    const result = reorderPagesSchema.safeParse({ pageIds: [] });
    expect(result.success).toBe(false);
  });
});
