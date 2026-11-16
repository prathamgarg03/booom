import type { Metadata } from "next";
import { geistUi } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Embed playground | Booom",
  description: "Preview the Booom embed on a sample page and copy the script tag.",
};

export default function EmbedPlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${geistUi.variable} min-h-screen bg-background font-ui text-foreground antialiased`}>
      {children}
    </div>
  );
}
