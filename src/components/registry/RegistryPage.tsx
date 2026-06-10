"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const API_BASE = "https://pixa-api.vercel.app";

type CatalogEndpoint = {
  path: string;
  method: string;
  price: string;
  payTo: string;
  category: string;
  dataSource: "live" | "simulated";
  upstream: string;
  description: string;
  params: Record<string, string>;
  returns: string[];
  exampleQuestion: string;
};

type Catalog = {
  service: string;
  version: string;
  description: string;
  agentInstructions: string[];
  network: string;
  networkLabel: string;
  payTo: string;
  facilitator: string;
  endpointCount: number;
  endpoints: CatalogEndpoint[];
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function RegistryPage() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [source, setSource] = useState<"all" | "live" | "simulated">("all");

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetch(`${API_BASE}/`)
      .then((res) => {
        if (!res.ok) throw new Error(`Catalog responded ${res.status}`);
        return res.json() as Promise<Catalog>;
      })
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    if (!catalog) return [];
    return [...new Set(catalog.endpoints.map((e) => e.category))].sort();
  }, [catalog]);

  const filtered = useMemo(() => {
    if (!catalog) return [];
    const q = query.trim().toLowerCase();
    return catalog.endpoints.filter((e) => {
      if (category !== "all" && e.category !== category) return false;
      if (source !== "all" && e.dataSource !== source) return false;
      if (!q) return true;
      return [e.path, e.description, e.category, e.upstream, e.exampleQuestion]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [catalog, query, category, source]);

  const liveCount = catalog
    ? catalog.endpoints.filter((e) => e.dataSource === "live").length
    : 0;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-pixa-black text-pixa-white">
      <div className="vault-fallback fixed inset-0 opacity-25" />
      <div className="micro-grid fixed inset-0 opacity-20" />
      <div className="grain-overlay fixed" />

      <header className="relative z-20 border-b border-white/10 bg-pixa-black/[0.92] px-5 py-5 backdrop-blur-xl sm:px-8">
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
          <div className="flex items-center gap-5 text-xs text-pixa-secondary sm:gap-7">
            <Link className="transition hover:text-pixa-white" href="/">
              Home
            </Link>
            <Link className="transition hover:text-pixa-white" href="/docs">
              Docs
            </Link>
            <span className="text-pixa-white">Registry</span>
            <a
              href={API_BASE}
              target="_blank"
              rel="noreferrer"
              className="chrome-button hidden h-10 items-center rounded-sm px-4 text-[0.68rem] font-medium uppercase sm:inline-flex"
            >
              API Base
            </a>
          </div>
        </nav>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <motion.section
          className="pt-16 sm:pt-24"
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="section-kicker">
            x402 Protocol / Algorand / Machine-Payable APIs
          </p>
          <h1 className="chrome-text display-type docs-heading mt-6 text-balance">
            Pixa Registry.
          </h1>
          <p className="section-copy mt-8 max-w-3xl">
            A unified catalog of pay-per-call APIs gated by the x402 protocol
            and settled in USDC on Algorand. No API keys, no subscriptions —
            agents pay micro-USDC per request and get structured JSON back.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 text-xs uppercase leading-none text-pixa-secondary">
            {[
              catalog?.networkLabel ?? "Algorand",
              "USDC Settlement",
              "x402 v2",
              catalog ? `v${catalog.version}` : "Live Catalog",
            ].map((badge) => (
              <span key={badge} className="border border-white/12 px-4 py-2">
                {badge}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.85, ease: EASE }}
        >
          {[
            [catalog ? String(catalog.endpointCount) : "—", "Endpoints listed"],
            [catalog ? String(liveCount) : "—", "Live data sources"],
            [
              catalog ? String(catalog.endpointCount - liveCount) : "—",
              "Simulated demos",
            ],
            ["$0.001", "Price floor / call"],
          ].map(([value, label]) => (
            <div key={label} className="metal-panel p-6">
              <p className="display-type text-4xl leading-none text-pixa-white">
                {value}
              </p>
              <p className="mt-3 text-xs uppercase text-pixa-secondary">
                {label}
              </p>
            </div>
          ))}
        </motion.section>

        <section className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-kicker">Catalog</p>
              <h2 className="display-type mt-4 text-3xl leading-tight text-pixa-white sm:text-5xl">
                Explore endpoints
              </h2>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search weather, fx, algorand…"
              className="h-12 w-full max-w-xs border border-white/12 bg-white/[0.02] px-4 text-sm text-pixa-white placeholder:text-pixa-muted focus:border-white/30 focus:outline-none"
            />
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {["all", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`border px-4 py-2 text-[0.68rem] uppercase leading-none transition ${
                  category === c
                    ? "border-white/40 text-pixa-white"
                    : "border-white/10 text-pixa-secondary hover:border-white/24 hover:text-pixa-white"
                }`}
              >
                {c}
              </button>
            ))}
            <span className="mx-2 hidden w-px bg-white/10 sm:block" />
            {(["all", "live", "simulated"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`border px-4 py-2 text-[0.68rem] uppercase leading-none transition ${
                  source === s
                    ? "border-white/40 text-pixa-white"
                    : "border-white/10 text-pixa-secondary hover:border-white/24 hover:text-pixa-white"
                }`}
              >
                {s === "all" ? "all sources" : s}
              </button>
            ))}
          </div>

          {error ? (
            <div className="metal-panel mt-10 p-8">
              <p className="text-sm leading-7 text-pixa-secondary">
                Could not load the live catalog from{" "}
                <span className="font-mono text-pixa-white">{API_BASE}</span> —{" "}
                {error}
              </p>
              <a
                href={API_BASE}
                target="_blank"
                rel="noreferrer"
                className="chrome-button mt-6 inline-flex h-11 items-center rounded-sm px-5 text-xs font-medium uppercase"
              >
                Open catalog directly
              </a>
            </div>
          ) : !catalog ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse border border-white/10 bg-white/[0.02]"
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((endpoint, i) => (
                <EndpointCard key={endpoint.path} endpoint={endpoint} index={i} />
              ))}
              {filtered.length === 0 ? (
                <p className="text-sm text-pixa-secondary">
                  No endpoints match that filter.
                </p>
              ) : null}
            </div>
          )}
        </section>

        {catalog ? (
          <motion.section
            className="mt-24"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <p className="section-kicker">Agent Flow</p>
            <h2 className="display-type mt-4 text-3xl leading-tight text-pixa-white sm:text-5xl">
              How agents pay
            </h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="edge-frame border border-white/12 bg-white/[0.02] p-7">
                <ol className="grid gap-4">
                  {catalog.agentInstructions.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-4 border-t border-white/10 pt-4 text-sm leading-7 text-pixa-secondary first:border-t-0 first:pt-0"
                    >
                      <span className="display-type shrink-0 text-pixa-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{step.replace(/^\d+\.\s*/, "")}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="metal-panel p-7">
                <p className="section-kicker">Settlement</p>
                <dl className="mt-6 grid gap-5 text-sm">
                  <div>
                    <dt className="text-xs uppercase text-pixa-muted">
                      Network
                    </dt>
                    <dd className="mt-1.5 font-mono text-pixa-white">
                      {catalog.networkLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-pixa-muted">
                      Facilitator
                    </dt>
                    <dd className="mt-1.5 break-all font-mono text-pixa-white">
                      {catalog.facilitator}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-pixa-muted">
                      Pay to
                    </dt>
                    <dd className="mt-1.5 break-all font-mono text-xs leading-6 text-pixa-secondary">
                      {catalog.payTo}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.section>
        ) : null}
      </div>

      <footer className="relative z-10 border-t border-white/10 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs text-pixa-secondary">
          <p>
            Pixa Registry — agent-native discovery for{" "}
            <span className="font-mono">x402</span> machine-payable APIs.
          </p>
          <a
            href={API_BASE}
            target="_blank"
            rel="noreferrer"
            className="font-mono transition hover:text-pixa-white"
          >
            pixa-api.vercel.app
          </a>
        </div>
      </footer>
    </main>
  );
}

function EndpointCard({
  endpoint,
  index,
}: {
  endpoint: CatalogEndpoint;
  index: number;
}) {
  const live = endpoint.dataSource === "live";
  return (
    <motion.article
      className="edge-frame group relative flex flex-col border border-white/12 bg-white/[0.025] p-6 shadow-silver"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.7, ease: EASE }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <p className="break-all font-mono text-sm leading-6 text-pixa-white">
          <span className="text-pixa-muted">{endpoint.method}</span>{" "}
          {endpoint.path}
        </p>
        <span
          className={`shrink-0 border px-2.5 py-1.5 text-[0.6rem] uppercase leading-none ${
            live
              ? "border-white/30 text-pixa-white"
              : "border-white/10 text-pixa-muted"
          }`}
        >
          {live ? "Live data" : "Simulated"}
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-pixa-secondary">
        {endpoint.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {endpoint.returns.slice(0, 6).map((field) => (
          <code
            key={field}
            className="border border-white/10 px-2 py-1 text-[0.65rem] leading-none text-pixa-muted"
          >
            {field}
          </code>
        ))}
      </div>
      <p className="mt-5 border-l border-white/15 pl-3 text-xs italic leading-6 text-pixa-muted">
        “{endpoint.exampleQuestion}”
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="min-w-0">
          <p className="font-mono text-sm text-pixa-white">{endpoint.price}</p>
          <p className="mt-1 truncate text-[0.65rem] uppercase text-pixa-muted">
            {endpoint.category} · {endpoint.upstream}
          </p>
        </div>
        <a
          href={`${API_BASE}${endpoint.path}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 border border-white/12 px-3 py-2 text-[0.65rem] uppercase leading-none text-pixa-secondary transition hover:border-white/30 hover:text-pixa-white"
        >
          402 challenge
        </a>
      </div>
    </motion.article>
  );
}
