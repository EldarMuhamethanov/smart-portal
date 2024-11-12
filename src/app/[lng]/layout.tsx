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
  title: "Smart Portal - Your Universal Tool for Smart Contract Interaction",
  description: "Smart Portal provides an easy-to-use interface for interacting with smart contracts on Ethereum, Polygon, BSC and other networks. Connect MetaMask or local network, add contracts, and start working with methods, storage, and events.",
  authors: {
    url: "https://github.com/EldarMuhamethanov",
    name: "EldarMuhamethanov",
  },
  robots: "index, follow",
  keywords: [
    "smart contracts",
    "ethereum",
    "blockchain",
    "web3",
    "dapp",
    "smart portal",
    "contract interaction",
    "metamask",
    "hardhat",
    "foundry",
    "blockchain development",
    "ethereum development"
  ],
  openGraph: {
    title: "Smart Portal - Your Universal Tool for Smart Contract Interaction",
    description: "Easy-to-use interface for interacting with smart contracts on multiple networks",
    type: "website",
    url: "https://smart-portal.xyz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Portal - Smart Contract Interaction Tool",
    description: "Easy-to-use interface for interacting with smart contracts",
  },
  alternates: {
    languages: {
      'en': '/en',
      'ru': '/ru',
      'fr': '/fr',
      'ch': '/ch'
    }
  }
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
      <head>
        <meta
          name="google-site-verification"
          content="2QkqNsABacNJY0X28EMkilBJt_K4y25FWUT85d3DQ28"
        />
        <meta name="yandex-verification" content="ec70ba14fbff8c7c" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
