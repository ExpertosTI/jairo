import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "JairoApp - Plataforma B2B Empresarial",
  description: "Conecta tu empresa con nuevos mercados. La red empresarial B2B líder para proveedores, distribuidores y socios comerciales.",
  keywords: "B2B, networking, empresas, directorio empresarial, proveedores, distribuidores",
  authors: [{ name: "JairoApp" }],
  openGraph: {
    title: "JairoApp - Plataforma B2B Empresarial",
    description: "Conecta tu empresa con nuevos mercados",
    type: "website",
    locale: "es_LA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
