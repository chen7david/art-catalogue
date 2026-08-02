import { describe, expect, it } from "vitest";
import { REQUIRED_PAGES } from "./required-pages";

describe("REQUIRED_PAGES", () => {
  it("includes preface, introduction, and table of contents", () => {
    const slugs = REQUIRED_PAGES.map((p) => p.slug);
    expect(slugs).toEqual(["preface", "introduction", "table-of-contents"]);
  });

  it("has a non-empty title for every page", () => {
    for (const page of REQUIRED_PAGES) {
      expect(page.title.length).toBeGreaterThan(0);
    }
  });
});
