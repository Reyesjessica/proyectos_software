import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comunicahain",
  description: "Plataforma para comunidades: registra proyectos, avances y presupuestos en tiempo real.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
