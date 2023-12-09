import type { Metadata } from "next";
import { inter, spline, aeonik } from "./config";
import { Providers } from "./providers";
import { ApolloProvider } from "@apollo/client";
import { client } from "./utils/client";

import "./globals.css";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Fluidity Leaderbord page",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${spline.className} ${aeonik.className}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export default RootLayout;
