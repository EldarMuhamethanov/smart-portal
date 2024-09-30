import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { dir } from "i18next";
import { languages } from "../i18n/settings";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Smart Portal",
  description: "Smart portal - your portal to the smart contracts world",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: { lng: string };
}>) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
