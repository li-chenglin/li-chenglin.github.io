import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chenglin Li",
  description: "Personal academic website of Chenglin Li, Ph.D. student at HKUST(GZ).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
