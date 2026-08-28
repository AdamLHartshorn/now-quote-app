import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOW Field Desk",
  description:
    "The sales quoting, routing, and reference workspace for NOW Courier.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NOW Field Desk",
  },

  openGraph: {
    title: "NOW Field Desk",
    description:
      "The sales quoting, routing, and reference workspace for NOW Courier.",
    siteName: "NOW Field Desk",
  },

  twitter: {
    card: "summary",
    title: "NOW Field Desk",
    description:
      "The sales quoting, routing, and reference workspace for NOW Courier.",
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
