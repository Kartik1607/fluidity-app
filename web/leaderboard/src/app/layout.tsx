import type { Metadata } from "next";
import { inter, spline, aeonik } from "./config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Fluidity Leaderbord page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${spline.className} ${aeonik.className}`}
    >
      <body>{children}</body>
    </html>
  );
}
