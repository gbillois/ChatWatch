import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatWatch",
  description: "RSS aggregation, clustering, and synthesis"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
