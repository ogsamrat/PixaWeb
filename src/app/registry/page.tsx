import type { Metadata } from "next";
import { RegistryPage } from "@/components/registry/RegistryPage";

export const metadata: Metadata = {
  title: "Registry | Pixa Wallet",
  description:
    "Browse the Pixa Registry — a unified catalog of x402 machine-payable APIs settled in USDC on Algorand. Live weather, FX rates, on-chain data, and more, priced per call.",
  alternates: {
    canonical: "/registry",
  },
  openGraph: {
    title: "Registry | Pixa Wallet",
    description:
      "Browse the Pixa Registry — a unified catalog of x402 machine-payable APIs settled in USDC on Algorand.",
    url: "https://pixawallet.xyz/registry",
    images: [
      {
        url: "/assets/pixa-bg.png",
        width: 1200,
        height: 630,
        alt: "Pixa Registry — machine-payable APIs",
      },
    ],
  },
};

export default function Registry() {
  return <RegistryPage />;
}
