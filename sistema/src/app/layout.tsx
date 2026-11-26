import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const outfit = localFont({
  variable: "--outfit",
  display: "swap",
  src: [
    { path: "../fuentes/Outfit-Light.ttf", weight: "300" },
    { path: "../fuentes/Outfit-Regular.ttf", weight: "400" },
    { path: "../fuentes/Outfit-Medium.ttf", weight: "500" },
    { path: "../fuentes/Outfit-SemiBold.ttf", weight: "600" },
    { path: "../fuentes/Outfit-ExtraBold.ttf", weight: "800" },
  ],
});

export const metadata: Metadata = {
  title: { default: "Producción · QUERVO Studios", template: "%s · QUERVO Studios" },
  description: "Sistema de producción de QUERVO Studios.",
  icons: { icon: "/marca/q_negativo.svg" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
