import { Geist, Newsreader } from "next/font/google";

export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const geistUi = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
