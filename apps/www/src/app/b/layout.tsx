import { geistUi, newsreader } from "@/lib/fonts";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`blog-theme ${newsreader.variable} ${geistUi.variable} min-h-screen bg-paper font-ui text-ink antialiased selection:bg-link/20 selection:text-ink`}
    >
      {children}
    </div>
  );
}
