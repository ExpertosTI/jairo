import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B2B SaaS Platform",
  description: "Multi-tenant B2B SaaS Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
