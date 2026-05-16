import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOW Courier Quote Tool",
  description: "Internal pricing and quoting platform for NOW Courier.",
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