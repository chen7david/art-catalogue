import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Sidebar } from "./Sidebar";

function renderSidebar() {
  return render(
    <JotaiProvider>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </JotaiProvider>
  );
}

describe("Sidebar", () => {
  it("renders the app title", () => {
    renderSidebar();
    expect(screen.getByText("Art Catalogue")).toBeInTheDocument();
  });

  it("renders a link to the catalogues list", () => {
    renderSidebar();
    expect(screen.getByRole("link", { name: "Catalogues" })).toHaveAttribute("href", "/");
  });
});
