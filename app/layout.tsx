import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOW Courier Quote Tool",
  description:
    "Internal pricing and operational quoting platform for NOW Courier.",

  openGraph: {
    title: "NOW Courier Quote Tool",
    description:
      "Internal pricing and operational quoting platform for NOW Courier.",
    siteName: "NOW Courier Quote Tool",
  },

  twitter: {
    card: "summary",
    title: "NOW Courier Quote Tool",
    description:
      "Internal pricing and operational quoting platform for NOW Courier.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}