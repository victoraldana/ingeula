import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IngeULA | Facultad de Ingeniería — Universidad de Los Andes",
    template: "%s | IngeULA · Facultad de Ingeniería ULA",
  },
  icons: {
    icon: "/images/logo-fi-ula.png",
    apple: "/images/logo-fi-ula.png",
  },
  description:
    "Portal institucional de la Facultad de Ingeniería de la Universidad de Los Andes (ULA), Mérida. Escuelas de Ingeniería de Sistemas, Eléctrica, Civil, Mecánica y Química.",
  keywords: [
    "IngeULA",
    "Facultad de Ingeniería ULA",
    "Universidad de Los Andes",
    "Mérida",
    "La Hechicera",
    "Ingeniería de Sistemas",
    "Ingeniería Eléctrica",
    "Ingeniería Civil",
    "Ingeniería Mecánica",
    "Ingeniería Química",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-[#0A1628] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
