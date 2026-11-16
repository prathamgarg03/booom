import { Geist, Newsreader } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`blog-theme ${newsreader.variable} ${geist.variable} min-h-screen bg-paper font-ui text-ink antialiased selection:bg-link/20 selection:text-ink`}
    >
      {children}
    </div>
  );
}
