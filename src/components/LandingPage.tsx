"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Download,
  ExternalLink,
  type LucideIcon,
  Network,
  ShieldCheck,
  Terminal,
  Wallet,
} from "lucide-react";
import { HeroVideo } from "@/components/HeroVideo";

const RELEASE_URL = "https://github.com/soumyacodes007/Pixa/releases/latest";
const DEMO_URL = "https://youtu.be/VGMRlsP6Tj0?si=tbwh-klI1O8NHYEh";

const metrics = [
  ["Network", "Algorand Mainnet"],
  ["Protocol", "MCP + x402"],
  ["Finality", "~3.3s"],
  ["Package", ".mcpb"],
];

const flow = [
  "Request",
  "402",
  "Budget",
  "Authorize",
  "Confirm",
  "Retry",
  "Result",
];

const modes = [
  ["Full autonomous", "Agent pays inside budget."],
  ["Session based", "Time and amount limits."],
  ["Human approval", "User signs before spend."],
];

const tools = [
  ["Wallet", "balance, transfers, funding"],
  ["x402", "pay, fetch, discover"],
  ["DeFi", "swap, token creation"],
];

const security = [
  "Budget limits",
  "Spending reports",
  "NFD resolution",
  "Keychain storage",
  "Finality checks",
];

const roadmap = [
  ["Now", "Mainnet wallet, x402, Tinyman, NFD, MCP bundle."],
  ["Next", "UPI to USDC onramp through Mudrex."],
  ["Future", "Non-custodial treasury and multi-chain routing."],
];

export function LandingPage() {
  const reduceMotion = useReducedMotion();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setHeroVisible(true);
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (heroVisible) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [heroVisible]);

  return (
    <main className="bg-pixa-black text-pixa-white">
      <section className="relative min-h-screen overflow-hidden bg-pixa-black">
        <HeroVideo
          shouldPlay={reduceMotion !== true}
          onDoorReveal={() => setHeroVisible(true)}
          onIntroComplete={() => setHeroVisible(true)}
        />

        <AnimatePresence>
          {heroVisible ? (
            <motion.header
              className="absolute left-0 right-0 top-0 z-20 px-5 py-5 sm:px-8"
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6">
                <Link href="/" aria-label="Pixa Wallet home" className="shrink-0">
                  <Image
                    src="/assets/logo.png"
                    alt="Pixa Wallet"
                    width={4800}
                    height={3200}
                    priority
                    className="h-10 w-auto object-contain sm:h-12"
                  />
                </Link>
                <div className="hidden items-center gap-7 text-xs text-pixa-secondary sm:flex">
                  <a className="transition hover:text-pixa-white" href="#product">
                    Product
                  </a>
                  <a className="transition hover:text-pixa-white" href="#install">
                    Install
                  </a>
                  <Link className="transition hover:text-pixa-white" href="/docs">
                    Docs
                  </Link>
                </div>
              </nav>
            </motion.header>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {heroVisible ? (
            <motion.div
              className="relative z-10 flex min-h-screen items-center px-6 pb-20 pt-32 sm:px-8"
              initial={{
                opacity: 0,
                filter: "blur(18px)",
                clipPath: "inset(48% 48% 48% 48%)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                clipPath: "inset(0% 0% 0% 0%)",
              }}
              transition={{ duration: 1.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mx-auto w-full max-w-7xl">
                <motion.div
                  className="outline-text display-type pointer-events-none absolute right-[-2rem] top-[18vh] hidden text-[12rem] uppercase leading-none opacity-55 xl:block"
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 0.7, x: 0 }}
                  transition={{
                    delay: 0.12,
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  PIXA
                </motion.div>
                <div className="edge-frame relative max-w-5xl px-5 py-7 sm:px-9 sm:py-9">
                  <motion.p
                    className="section-kicker"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16, duration: 0.8 }}
                  >
                    MCP Native / Algorand Mainnet / x402
                  </motion.p>
                  <motion.h1
                    className="chrome-text display-type hero-heading mt-6 max-w-5xl text-balance"
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 1 }}
                  >
                    Agentic payments in under 60 seconds.
                  </motion.h1>
                  <motion.p
                    className="section-copy mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.44, duration: 0.9 }}
                  >
                    The first agentic payment wallet built for Algorand. Plug
                    into Claude or any agent framework.
                  </motion.p>
                  <motion.div
                    className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.58, duration: 0.8 }}
                  >
                    <a
                      href={RELEASE_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="chrome-button inline-flex h-14 items-center justify-center gap-3 rounded-sm px-7 text-sm font-medium uppercase transition duration-500 ease-cinematic focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                      Download MCP Bundle
                      <Download className="h-4 w-4" aria-hidden />
                    </a>
                    <Link
                      href="/docs"
                      className="inline-flex h-14 items-center justify-center gap-3 rounded-sm border border-white/14 bg-white/[0.035] px-7 text-sm font-medium uppercase text-pixa-white transition duration-500 ease-cinematic hover:border-white/28 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                      Read Docs
                      <BookOpen className="h-4 w-4" aria-hidden />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section
        id="product"
        className="relative isolate overflow-hidden bg-pixa-black px-6 py-32 sm:px-8 sm:py-44"
      >
        <div className="vault-fallback absolute inset-0 opacity-35" />
        <div className="micro-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-x-[8%] top-0 h-px silver-line opacity-50" />
        <div className="grain-overlay" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
            <motion.div
              className="edge-frame px-5 py-8 sm:px-8"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="section-kicker">Product</p>
              <h2 className="chrome-text display-type section-heading mt-6 max-w-4xl text-balance">
                Agents can pay now.
              </h2>
              <p className="section-copy mt-8">
                Pixa gives AI agents the ability to discover, authorize, and
                settle micropayments using x402 on Algorand.
              </p>
            </motion.div>

            <motion.div
              className="edge-frame relative overflow-hidden border border-white/12 bg-white/[0.025] p-7 shadow-silver"
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="outline-text display-type absolute -right-4 bottom-0 text-9xl leading-none opacity-50">
                MCP
              </div>
              <div className="relative grid gap-3 sm:grid-cols-2">
                {metrics.map(([label, value]) => (
                  <div key={label} className="border border-white/10 p-5">
                    <p className="text-xs uppercase text-pixa-muted">{label}</p>
                    <p className="display-type mt-3 text-2xl leading-tight text-pixa-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <XLoopSection />

      <section className="relative overflow-hidden bg-pixa-black px-6 py-32 sm:px-8 sm:py-44">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#030303,rgba(255,255,255,0.035),#030303)]" />
        <div className="grain-overlay" />
        <div className="relative mx-auto max-w-7xl">
          <p className="section-kicker">x402 Flow</p>
          <h2 className="chrome-text display-type section-heading mt-6 max-w-5xl text-balance">
            Request. Pay. Continue.
          </h2>
          <div className="mt-14 grid gap-3 lg:grid-cols-7">
            {flow.map((item, index) => (
              <motion.div
                key={item}
                className="edge-frame relative min-h-36 border border-white/12 bg-white/[0.02] p-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="display-type text-xs text-pixa-muted">
                  0{index + 1}
                </span>
                <p className="display-type mt-9 text-2xl uppercase leading-tight text-pixa-white">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-pixa-black px-6 py-32 sm:px-8 sm:py-44">
        <div className="vault-fallback absolute inset-0 opacity-30" />
        <div className="grain-overlay" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.88fr_1.12fr]">
          <motion.div
            className="edge-frame px-5 py-8 sm:px-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-kicker">Autonomy</p>
            <h2 className="chrome-text display-type section-heading mt-6 text-balance">
              Three modes.
            </h2>
            <p className="section-copy mt-8 max-w-sm">
              Full autonomy when you want it. Human approval when you need it.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {modes.map(([title, copy], index) => (
              <motion.article
                key={title}
                className="edge-frame border border-white/12 bg-white/[0.02] p-7"
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="display-type text-xs text-pixa-muted">
                  MODE 0{index + 1}
                </p>
                <h3 className="display-type mt-4 text-3xl leading-tight text-pixa-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-pixa-secondary">
                  {copy}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="install"
        className="relative overflow-hidden bg-pixa-black px-6 py-32 sm:px-8 sm:py-44"
      >
        <div className="micro-grid absolute inset-0 opacity-20" />
        <div className="grain-overlay" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="section-kicker">Install</p>
              <h2 className="chrome-text display-type section-heading mt-6 text-balance">
                One click for Claude.
              </h2>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href={RELEASE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="chrome-button inline-flex h-14 items-center justify-center gap-3 rounded-sm px-7 text-sm font-medium uppercase"
                >
                  Download MCP Bundle
                  <Download className="h-4 w-4" aria-hidden />
                </a>
                <Link
                  href="/docs#claude-desktop"
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-sm border border-white/14 bg-white/[0.035] px-7 text-sm font-medium uppercase text-pixa-white"
                >
                  JSON Config
                  <Terminal className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>

            <div className="edge-frame border border-white/12 bg-white/[0.02] p-6">
              <pre className="overflow-x-auto text-sm leading-7 text-pixa-secondary">
                <code>{`{
  "mcpServers": {
    "pixa": {
      "command": "npx",
      "args": ["-y", "pixa-wallet-mcp"],
      "env": {
        "NETWORK": "algorand-mainnet",
        "MAX_PER_CALL": "0.10",
        "MAX_PER_DAY": "20.00"
      }
    }
  }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-pixa-black px-6 py-32 sm:px-8 sm:py-44">
        <div className="vault-fallback absolute inset-0 opacity-25" />
        <div className="grain-overlay" />
        <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <Panel icon={Wallet} title="Tools" items={tools.map(([title]) => title)} />
          <Panel icon={ShieldCheck} title="Security" items={security} />
          <Panel
            icon={Network}
            title="Why Algorand"
            items={["Fast finality", "Low fees", "Native USDC", "Atomic rails"]}
          />
        </div>
      </section>

      <section className="relative overflow-hidden bg-pixa-black px-6 py-32 sm:px-8 sm:py-44">
        <div className="grain-overlay" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="section-kicker">Roadmap</p>
              <h2 className="chrome-text display-type section-heading mt-6 text-balance">
                Mainnet now.
              </h2>
            </div>
            <div className="grid gap-4">
              {roadmap.map(([phase, copy]) => (
                <article
                  key={phase}
                  className="edge-frame border border-white/12 bg-white/[0.02] p-7"
                >
                  <p className="section-kicker">{phase}</p>
                  <p className="mt-4 text-base leading-8 text-pixa-secondary">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-16 flex flex-col gap-4 sm:flex-row">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-sm border border-white/14 bg-white/[0.035] px-7 text-sm font-medium uppercase text-pixa-white"
            >
              Watch Demo
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
            <Link
              href="/docs"
              className="chrome-button inline-flex h-14 items-center justify-center gap-3 rounded-sm px-7 text-sm font-medium uppercase"
            >
              Open Docs
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function XLoopSection() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-pixa-black px-6 py-28 sm:px-8 sm:py-40">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#030303,rgba(255,255,255,0.035),#030303)]" />
      <div className="grain-overlay" />

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-45"
        preload="none"
        playsInline
        muted
        loop
        autoPlay
      >
        <source src="/assets/pixa-x-loop.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent,rgba(3,3,3,0.74)_48%,#030303_88%)]" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[86vh] w-[86vw] -translate-x-1/2 -translate-y-1/2 opacity-70"
        initial={{ opacity: 0, scale: 0.78, filter: "blur(18px)" }}
        whileInView={{ opacity: 0.7, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/assets/x-logo.png"
          alt=""
          fill
          sizes="86vw"
          className="object-contain drop-shadow-[0_0_120px_rgba(255,255,255,0.28)]"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#030303_0%,rgba(3,3,3,0.82)_18%,rgba(3,3,3,0.22)_48%,rgba(3,3,3,0.82)_78%,#030303_100%)]" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center text-center">
        <motion.div
          className="edge-frame max-w-3xl px-5 py-8 sm:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-kicker">Pixa Core</p>
          <h2 className="chrome-text display-type section-heading relative z-10 mx-auto mt-6 max-w-3xl text-balance">
            The wallet layer for machine intent.
          </h2>
          <p className="section-copy relative z-10 mx-auto mt-8 max-w-md">
            Agents request. Pixa guards. Algorand settles.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-6 right-6 mx-auto flex max-w-7xl items-center justify-between border-t border-white/12 pt-5 text-xs uppercase text-pixa-secondary sm:left-8 sm:right-8">
        <span>x402</span>
        <span>Algorand</span>
      </div>
    </section>
  );
}

function Panel({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
}) {
  return (
    <article className="edge-frame min-h-80 border border-white/12 bg-white/[0.02] p-7">
      <Icon className="h-5 w-5 text-pixa-secondary" aria-hidden />
      <h3 className="chrome-text display-type mt-7 text-5xl leading-tight">
        {title}
      </h3>
      <div className="mt-8 grid gap-3">
        {items.map((item) => (
          <p
            key={item}
            className="border-t border-white/10 pt-3 text-sm uppercase text-pixa-secondary"
          >
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}
