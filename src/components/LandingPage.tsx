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

const MCP_BUNDLE_URL = "/assets/pixa.mcpb";
const DEMO_URL = "https://youtu.be/DAMOl6qfrh0?si=RdTpNbjuRsw-HfGm";
const PRODUCT_DEMO_EMBED_URL =
  "https://www.youtube-nocookie.com/embed/DAMOl6qfrh0?autoplay=1&mute=1&loop=1&playlist=DAMOl6qfrh0&controls=0&modestbranding=1&rel=0&playsinline=1";

const metrics = [
  ["Network", "Algorand Mainnet"],
  ["Protocol", "MCP + x402"],
  ["Finality", "~3.3s"],
  ["Package", ".mcpb"],
];

const flow = [
  ["01", "Request", "Agent reaches a paid endpoint."],
  ["02", "402", "Price, recipient, and network return."],
  ["03", "Guard", "Pixa checks budget and policy."],
  ["04", "Authorize", "USDC payment signs on Algorand."],
  ["05", "Settle", "Finality confirms in seconds."],
  ["06", "Unlock", "The resource returns to the agent."],
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

type FixedXMode = "hidden" | "origin" | "settled";

export function LandingPage() {
  const reduceMotion = useReducedMotion();
  const [heroVisible, setHeroVisible] = useState(false);
  const [fixedXMode, setFixedXMode] = useState<FixedXMode>("hidden");

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

  useEffect(() => {
    if (!heroVisible) {
      return;
    }

    function updateFixedX() {
      const viewportHeight = window.innerHeight;
      const getSectionBounds = (sectionId: string) => {
        const section = document.getElementById(sectionId);

        return section?.getBoundingClientRect();
      };

      const sectionIsActive = (sectionId: string) => {
        const bounds = getSectionBounds(sectionId);

        return Boolean(
          bounds &&
            bounds.top < viewportHeight * 0.82 &&
            bounds.bottom > viewportHeight * 0.16,
        );
      };
      const toolsBounds = getSectionBounds("tools-panel");
      const roadmapBounds = getSectionBounds("roadmap");
      const toolsThroughRoadmap = Boolean(
        toolsBounds &&
          roadmapBounds &&
          toolsBounds.top < viewportHeight * 0.82 &&
          roadmapBounds.bottom > viewportHeight * 0.16,
      );

      if (toolsThroughRoadmap) {
        setFixedXMode("settled");
        return;
      }

      if (
        sectionIsActive("product") &&
        window.scrollY > viewportHeight * 0.72
      ) {
        setFixedXMode("origin");
        return;
      }

      setFixedXMode("hidden");
    }

    updateFixedX();
    window.addEventListener("scroll", updateFixedX, { passive: true });
    window.addEventListener("resize", updateFixedX);

    return () => {
      window.removeEventListener("scroll", updateFixedX);
      window.removeEventListener("resize", updateFixedX);
    };
  }, [heroVisible]);

  return (
    <main className="bg-pixa-black text-pixa-white">
      <AnimatePresence>
        {fixedXMode !== "hidden" ? (
          <FixedOriginX key={fixedXMode} mode={fixedXMode} />
        ) : null}
      </AnimatePresence>

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
                <div className="edge-frame relative max-w-5xl -translate-y-8 px-5 py-7 sm:-translate-y-12 sm:px-9 sm:py-9">
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
                      href={MCP_BUNDLE_URL}
                      download
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
              <div className="outline-text display-type pointer-events-none absolute -right-4 bottom-0 text-9xl leading-none opacity-50">
                MCP
              </div>
              <div className="relative z-10 grid gap-3 sm:grid-cols-2">
                {metrics.map(([label, value]) => (
                  <div key={label} className="border border-white/10 p-5">
                    <p className="text-xs uppercase text-pixa-muted">{label}</p>
                    <p className="display-type mt-3 text-2xl leading-tight text-pixa-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="relative z-10 mt-3 hidden overflow-hidden border border-white/10 bg-pixa-black/80 shadow-silver lg:block">
                <div className="absolute inset-x-0 top-0 z-10 h-px silver-line opacity-70" />
                <div className="relative aspect-video">
                  <iframe
                    className="h-full w-full scale-[1.02] opacity-70 grayscale contrast-125 saturate-0"
                    src={PRODUCT_DEMO_EMBED_URL}
                    title="Pixa Wallet demo"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="autoplay; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent,rgba(3,3,3,0.26)_55%,#030303_100%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_18%,transparent_74%,rgba(3,3,3,0.74))]" />
                  <div className="outline-text display-type pointer-events-none absolute bottom-1 left-4 z-10 text-[4.8rem] leading-none opacity-65 mix-blend-screen">
                    MCP
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-[0.68rem] uppercase text-pixa-muted">
                  <span>Live Demo</span>
                  <span>Claude / MCP / x402</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <XLoopSection />

      <section
        id="x402-flow"
        className="relative isolate overflow-hidden bg-pixa-black px-6 py-32 sm:px-8 sm:py-44"
      >
        <div className="vault-fallback absolute inset-0 opacity-25" />
        <div className="micro-grid absolute inset-0 opacity-15" />
        <div className="absolute inset-x-[10%] top-0 h-px silver-line opacity-45" />
        <div className="grain-overlay" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <motion.div
            className="edge-frame px-5 py-8 sm:px-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-kicker">x402 Flow</p>
            <h2 className="chrome-text display-type section-heading mt-6 max-w-2xl text-balance">
              The paywall becomes a protocol handshake.
            </h2>
            <p className="section-copy mt-8 max-w-md">
              Pixa converts HTTP 402 into a budgeted Algorand payment and keeps
              the agent moving.
            </p>
          </motion.div>

          <motion.div
            className="edge-frame relative overflow-hidden border border-white/12 bg-white/[0.025] p-4 shadow-silver sm:p-6"
            initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-white/[0.07] blur-3xl" />
            <div className="pointer-events-none absolute inset-x-6 top-1/2 hidden h-px silver-line opacity-55 lg:block" />
            <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {flow.map(([step, title, copy], index) => (
                <motion.article
                  key={title}
                  className="group relative min-h-44 overflow-hidden border border-white/10 bg-pixa-black/70 p-5"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.72,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <p className="display-type text-xs text-pixa-muted">{step}</p>
                  <h3 className="display-type mt-8 text-2xl uppercase leading-tight text-pixa-white">
                    {title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-pixa-secondary">
                    {copy}
                  </p>
                </motion.article>
              ))}
            </div>
            <div className="relative mt-4 grid gap-3 text-[0.68rem] uppercase text-pixa-muted sm:grid-cols-3">
              <div className="border border-white/10 px-4 py-3">Agent</div>
              <div className="border border-white/10 px-4 py-3">Pixa MCP</div>
              <div className="border border-white/10 px-4 py-3">
                Algorand
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="autonomy"
        className="relative isolate overflow-hidden bg-pixa-black px-6 py-32 sm:px-8 sm:py-44"
      >
        <Image
          src="/assets/pixa-bg2.png"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.42]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,transparent,rgba(3,3,3,0.58)_44%,#030303_88%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#030303_0%,rgba(3,3,3,0.78)_24%,rgba(3,3,3,0.36)_54%,#030303_100%)]" />
        <div className="vault-fallback absolute inset-0 opacity-[0.18] mix-blend-screen" />
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
                  href={MCP_BUNDLE_URL}
                  download
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

            <div className="edge-frame overflow-hidden border border-white/12 bg-white/[0.025] shadow-silver">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white/35" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/12" />
                </div>
                <div className="flex items-center gap-3 text-[0.68rem] uppercase text-pixa-muted">
                  <span>claude_desktop_config</span>
                  <span className="border border-white/12 bg-pixa-black/60 px-2 py-1 text-pixa-secondary">
                    JSON
                  </span>
                </div>
              </div>
              <pre className="overflow-x-auto px-5 py-6 text-sm leading-7 text-pixa-secondary">
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

      <section
        id="tools-panel"
        className="relative isolate overflow-hidden bg-pixa-black px-6 py-32 sm:px-8 sm:py-44"
      >
        <div className="vault-fallback absolute inset-0 opacity-30" />
        <div className="micro-grid absolute inset-0 opacity-15" />
        <div className="absolute inset-x-[8%] top-0 h-px silver-line opacity-45" />
        <div className="grain-overlay" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="section-kicker">Capability Surface</p>
            <div className="hidden h-px flex-1 silver-line opacity-45 lg:block" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel
              icon={Wallet}
              index="01"
              title="Tools"
              items={tools.map(([title]) => title)}
            />
            <Panel
              icon={ShieldCheck}
              index="02"
              title="Security"
              items={security}
            />
            <Panel
              icon={Network}
              index="03"
              title="Why Algorand"
              items={[
                "Fast finality",
                "Low fees",
                "Native USDC",
                "Atomic rails",
              ]}
            />
          </div>
        </div>
      </section>

      <section
        id="roadmap"
        className="relative isolate overflow-hidden bg-pixa-black px-6 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36"
      >
        <Image
          src="/assets/pixa-bg3.png"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.66]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_32%,transparent,rgba(3,3,3,0.34)_42%,#030303_90%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#030303_0%,rgba(3,3,3,0.26)_28%,rgba(3,3,3,0.58)_70%,#030303_100%)]" />
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
    <section
      id="pixa-core"
      className="relative isolate overflow-hidden bg-pixa-black px-6 py-28 sm:px-8 sm:py-40"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#030303,rgba(255,255,255,0.035),#030303)]" />
      <div className="grain-overlay" />

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        preload="none"
        playsInline
        muted
        loop
        autoPlay
      >
        <source src="/assets/pixa-x-loop.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,transparent,rgba(3,3,3,0.8)_46%,#030303_86%)]" />

      <div className="relative mx-auto flex min-h-[68vh] max-w-7xl items-center">
        <motion.div
          className="edge-frame max-w-3xl px-5 py-8 sm:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-kicker">Pixa Core</p>
          <h2 className="chrome-text display-type section-heading relative z-10 mt-6 max-w-3xl text-balance">
            The wallet layer for machine intent.
          </h2>
          <p className="section-copy relative z-10 mt-8 max-w-md">
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

function FixedOriginX({ mode }: { mode: Exclude<FixedXMode, "hidden"> }) {
  const settled = mode === "settled";

  return (
    <motion.div
      className="pointer-events-none fixed bottom-[-4rem] right-[-3rem] z-10 h-[14rem] w-[14rem] overflow-hidden opacity-35 sm:bottom-[-5rem] sm:right-[-4rem] sm:h-[20rem] sm:w-[20rem] lg:bottom-[-7rem] lg:right-[-5rem] lg:h-[28rem] lg:w-[28rem]"
      initial={
        settled
          ? {
              opacity: 0,
              x: "6vw",
              y: "18vh",
              scale: 0.86,
              rotate: 18,
              filter: "blur(18px)",
            }
          : {
              opacity: 0,
              x: "-56vw",
              y: "-78vh",
              scale: 0.2,
              rotate: -120,
              filter: "blur(20px)",
            }
      }
      animate={{
        opacity: settled ? 0.28 : 0.34,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        filter: settled ? "blur(4px)" : "blur(3px)",
      }}
      exit={
        settled
          ? {
              opacity: 0,
              x: 0,
              y: "22vh",
              scale: 0.92,
              rotate: 0,
              filter: "blur(16px)",
            }
          : {
              opacity: 0,
              x: "8vw",
              y: "30vh",
              scale: 0.76,
              rotate: 24,
              filter: "blur(18px)",
            }
      }
      transition={{
        duration: settled ? 0.95 : 1.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_58%)] blur-3xl" />
      <Image
        src="/assets/x-logo.png"
        alt=""
        fill
        sizes="28rem"
        className="scale-[2.45] object-contain opacity-75 mix-blend-screen drop-shadow-[0_0_72px_rgba(255,255,255,0.14)]"
      />
    </motion.div>
  );
}

function Panel({
  icon: Icon,
  index,
  title,
  items,
}: {
  icon: LucideIcon;
  index: string;
  title: string;
  items: string[];
}) {
  return (
    <motion.article
      className="edge-frame group relative min-h-[28rem] overflow-hidden border border-white/12 bg-white/[0.025] p-7 shadow-silver"
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="outline-text display-type pointer-events-none absolute right-5 top-20 w-28 text-right text-8xl leading-none opacity-40">
        {index}
      </div>
      <div className="relative flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center border border-white/12 bg-white/[0.035]">
          <Icon className="h-5 w-5 text-pixa-secondary" aria-hidden />
        </div>
        <span className="min-w-20 text-right text-xs uppercase text-pixa-muted">
          Pixa / {index}
        </span>
      </div>
      <h3 className="chrome-text display-type relative mt-10 text-5xl leading-tight">
        {title}
      </h3>
      <div className="relative mt-10 grid gap-2">
        {items.map((item) => (
          <p
            key={item}
            className="flex items-center justify-between border-t border-white/10 pt-3 text-sm uppercase text-pixa-secondary"
          >
            <span>{item}</span>
            <span className="h-px w-8 bg-white/18" />
          </p>
        ))}
      </div>
    </motion.article>
  );
}
