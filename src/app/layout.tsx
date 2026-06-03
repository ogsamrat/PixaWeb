import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const SITE_URL = "https://pixawallet.xyz";
const SITE_NAME = "Pixa Wallet";
const SITE_DESCRIPTION =
  "Pixa Wallet is an agentic payment wallet for Algorand, MCP-native agents, x402 payments, budget limits, and autonomous settlement.";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Pixa Wallet | Agentic Payments on Algorand",
    template: "%s | Pixa Wallet",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Pixa Wallet",
    "agentic wallet",
    "AI agent payments",
    "Algorand wallet",
    "MCP wallet",
    "x402 payments",
    "agentic payments",
    "autonomous payments",
    "Algorand USDC",
  ],
  authors: [{ name: "Pixa Wallet", url: SITE_URL }],
  creator: "Pixa Wallet",
  publisher: "Pixa Wallet",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/assets/favicon/favicon.ico" },
      {
        url: "/assets/favicon/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/assets/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/assets/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/assets/favicon/site.webmanifest",
  openGraph: {
    title: "Pixa Wallet | Agentic Payments on Algorand",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/pixa-bg.png",
        width: 1200,
        height: 630,
        alt: "Pixa Wallet cinematic product visual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixa Wallet | Agentic Payments on Algorand",
    description: SITE_DESCRIPTION,
    images: ["/assets/pixa-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Cross-platform",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  sameAs: [
    "https://github.com/soumyacodes007/Pixa",
    "https://github.com/ogsamrat/PixaWeb/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
