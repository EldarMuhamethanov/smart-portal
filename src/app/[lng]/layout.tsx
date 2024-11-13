import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { dir } from "i18next";
import { languages } from "../i18n/settings";

const keywords =
  "smart contracts, ethereum, blockchain, web3, dapp, decentralized application, smart contract interaction, ethereum network, blockchain platform, cryptocurrency, ETH, smart portal, smart contract deployment, blockchain technology, ethereum wallet, web3 integration, smart contract development, blockchain interface, decentralized finance, DeFi, ethereum transactions, gas fees, metamask, ethereum blockchain, smart contract security, blockchain explorer, ethereum smart contracts, crypto wallet, blockchain platform, digital assets, cryptocurrency exchange, blockchain development, smart contract audit, ethereum mining, blockchain solutions, crypto payments, blockchain infrastructure, smart contract platform, ethereum ecosystem, blockchain technology, decentralized network, crypto trading, blockchain security, smart contract tools, ethereum development, blockchain applications, crypto investment, smart contract management, blockchain protocol, ethereum mining, digital currency, cryptocurrency wallet, blockchain consulting";

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
  authors: {
    url: "https://github.com/EldarMuhamethanov",
    name: "EldarMuhamethanov",
  },
  robots: "index, follow",
  keywords,
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
