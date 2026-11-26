import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
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
  icons: {
    icon: [
      { url: "/marca/q_negativo.svg", media: "(prefers-color-scheme: dark)" },
      { url: "/marca/q_positivo.svg", media: "(prefers-color-scheme: light)" },
    ],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tema = (await cookies()).get("tema")?.value;
  return (
    <html lang="es" className={outfit.variable} data-tema={tema === "dia" || tema === "noche" ? tema : undefined}>
      <body>{children}</body>
    </html>
  );
}
