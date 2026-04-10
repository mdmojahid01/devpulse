import { HashRouter, Route, Routes } from "react-router-dom";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useMemo } from "react";
import HomePage from "@/pages/HomePage";

export default function App() {
  // Global keyboard shortcuts (app-wide)
  const globalShortcuts = useMemo(
    () => [
      {
        key: "g",
        ctrlOrCmd: true,
        handler: () => {
          globalThis.location.href = "https://www.google.com";
        },
        description: "Open Google",
      },
    ],
    [],
  );

  useGlobalShortcuts(globalShortcuts);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}
