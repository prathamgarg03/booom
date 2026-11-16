import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import "@fontsource-variable/geist/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "./index.css";
import App from "./App";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { studioEnv } from "./lib/env";

const convex = new ConvexReactClient(studioEnv.VITE_CONVEX_URL);

function applyDocumentShell() {
  document.documentElement.lang = "en";
}

applyDocumentShell();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={studioEnv.VITE_CLERK_PUBLISHABLE_KEY}>
      <TooltipProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <App />
          <Toaster position="bottom-right" />
        </ConvexProviderWithClerk>
      </TooltipProvider>
    </ClerkProvider>
  </StrictMode>,
);
