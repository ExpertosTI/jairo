import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ToastProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
