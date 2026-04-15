import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toast } from "@heroui/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Toast.Provider placement="top" />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
