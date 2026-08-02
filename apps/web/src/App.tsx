import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { CataloguesPage } from "@/pages/CataloguesPage";
import { CataloguePage } from "@/pages/CataloguePage";
import { PrintCataloguePage } from "@/pages/PrintCataloguePage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/catalogues/:catalogueId/print" element={<PrintCataloguePage />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<CataloguesPage />} />
        <Route path="/catalogues/:catalogueId" element={<CataloguePage />} />
      </Route>
    </Routes>
  );
}
