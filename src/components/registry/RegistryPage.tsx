"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const REGISTRY_BASE = "https://pixaregistry.vercel.app";
const API_BASE = `${REGISTRY_BASE}/api`;

const EASE = [0.16, 1, 0.3, 1] as const;

type TrustTier =
  | "verified"
  | "community"
  | "experimental"
  | "flaky"
  | "broken"
  | "unverified";

type TrustScores = {
  operational: number;
  schema: number;
  domain: number | null;
  community: number | null;
  reliability: number;
  uptime: number;
  tier: TrustTier;
  labels: string[];
};

type AgentResultCard = {
  serviceId: string;
  name: string;
  resourceUrl: string;
  method: string;
  shortDescription: string;
  priceDisplay: string | null;
  paymentNetworks: string[];
  walletCompatibility: string;
  trustTier: TrustTier;
  labels: string[];
};

type SearchResult = { card: AgentResultCard; score: number };

type Stats = {
  total: number;
  byStatus: Record<string, number>;
  byTier: Record<string, number>;
};

type NetworkInfo = {
  id: string;
  displayName: string;
  isTestnet: boolean;
};

type SubmitResponse = {
  created: boolean;
  service: {
    serviceId: string;
    name: string;
    resourceUrl: string;
    priceDisplay: string | null;
    status: string;
    scores: TrustScores;
  };
  verification: {
    status: string;
    scores: TrustScores;
    warnings: string[];
  } | null;
};

const TIER_STYLE: Record<TrustTier, string> = {
  verified: "border-white/45 text-pixa-white",
  community: "border-white/30 text-pixa-white/90",
  experimental: "border-white/20 text-pixa-secondary",
  flaky: "border-white/15 text-pixa-secondary",
  broken: "border-white/10 text-pixa-muted",
  unverified: "border-white/10 text-pixa-muted",
};

function shortNetwork(id: string): string {
  if (id.startsWith("algorand:"))
    return id.includes("SGO1GKSz") ? "algorand-testnet" : "algorand";
  if (id.startsWith("eip155:")) return `evm:${id.slice(7)}`;
  if (id.length > 24) return `${id.slice(0, 21)}…`;
  return id;
}

function TierBadge({ tier }: { tier: TrustTier }) {
  return (
    <span
      className={`shrink-0 border px-2.5 py-1.5 text-[0.6rem] uppercase leading-none ${TIER_STYLE[tier]}`}
    >
      {tier === "verified" ? "● " : "○ "}
      {tier}
    </span>
  );
}

export function RegistryPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [networks, setNetworks] = useState<NetworkInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const refreshStats = useCallback(() => {
    fetch(`${API_BASE}/stats`)
      .then((r) => r.json() as Promise<Stats>)
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshStats();
    fetch(`${API_BASE}/categories`)
      .then(
        (r) => r.json() as Promise<{ withValidators: string[]; declared: string[] }>,
      )
      .then((c) =>
        setCategories([...new Set([...c.withValidators, ...c.declared])].sort()),
      )
      .catch(() => {});
    fetch(`${API_BASE}/networks`)
      .then((r) => r.json() as Promise<{ networks: NetworkInfo[] }>)
      .then((r) => setNetworks(r.networks))
      .catch(() => {});
  }, [refreshStats]);

  const runSearch = useCallback(() => {
    const qs = new URLSearchParams();
    if (query.trim()) qs.set("q", query.trim());
    if (category !== "all") qs.set("category", category);
    qs.set("limit", "60");
    setError(null);
    return fetch(`${API_BASE}/search?${qs}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Registry responded ${res.status}`);
        return res.json() as Promise<{ results: SearchResult[] }>;
      })
      .then((data) => setResults(data.results))
      .catch((err: Error) => setError(err.message));
  }, [query, category]);

  useEffect(() => {
    const t = setTimeout(runSearch, query ? 300 : 0);
    return () => clearTimeout(t);
  }, [runSearch, query]);

  const verifiedCount = stats?.byTier.verified ?? 0;
  const activeCount = stats?.byStatus.active ?? 0;

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
              href="#register"
              className="chrome-button hidden h-10 items-center rounded-sm px-4 text-[0.68rem] font-medium uppercase sm:inline-flex"
            >
              Register your API
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
            x402 Protocol / Trust-Scored / Machine-Payable APIs
          </p>
          <h1 className="chrome-text display-type docs-heading mt-6 text-balance">
            Pixa Registry.
          </h1>
          <p className="section-copy mt-8 max-w-3xl">
            The verified discovery layer for pay-per-call APIs. Every listing is
            probed live — reachability, x402 payment gating, schemas, even real
            on-chain settlement — then trust-scored so agents know exactly what
            they are paying for. Register yours below.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 text-xs uppercase leading-none text-pixa-secondary">
            {[
              "Algorand · USDC",
              "x402 v2",
              "Live Verification",
              "Open Registration",
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
            [stats ? String(stats.total) : "—", "Services listed"],
            [stats ? String(verifiedCount) : "—", "Tier: verified"],
            [stats ? String(activeCount) : "—", "Active right now"],
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
                Explore services
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
          </div>

          {error ? (
            <div className="metal-panel mt-10 p-8">
              <p className="text-sm leading-7 text-pixa-secondary">
                Could not reach the registry at{" "}
                <span className="font-mono text-pixa-white">{API_BASE}</span> —{" "}
                {error}
              </p>
              <a
                href={REGISTRY_BASE}
                target="_blank"
                rel="noreferrer"
                className="chrome-button mt-6 inline-flex h-11 items-center rounded-sm px-5 text-xs font-medium uppercase"
              >
                Open registry directly
              </a>
            </div>
          ) : !results ? (
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
              {results.map((r, i) => (
                <ServiceCard key={r.card.serviceId} card={r.card} index={i} />
              ))}
              {results.length === 0 ? (
                <p className="text-sm text-pixa-secondary">
                  No services match that filter.
                </p>
              ) : null}
            </div>
          )}
        </section>

        <RegisterWizard
          categories={categories}
          networks={networks}
          onRegistered={() => {
            refreshStats();
            runSearch();
          }}
        />

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
                {[
                  "Discover a service through the registry search API and read its trust tier, price, and payment networks.",
                  "Call the endpoint with no payment — the server replies 402 with an x402 challenge listing every accepted payment option.",
                  "Sign a USDC payment for the quoted amount with your Algorand wallet.",
                  "Retry the request with the payment-signature header; the facilitator settles it on-chain and the API returns your data.",
                  "The registry re-verifies listings continuously — paid probes settle real USDC and record the transaction id as proof.",
                ].map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-4 border-t border-white/10 pt-4 text-sm leading-7 text-pixa-secondary first:border-t-0 first:pt-0"
                  >
                    <span className="display-type shrink-0 text-pixa-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="metal-panel p-7">
              <p className="section-kicker">Registry API</p>
              <dl className="mt-6 grid gap-5 text-sm">
                <div>
                  <dt className="text-xs uppercase text-pixa-muted">Search</dt>
                  <dd className="mt-1.5 break-all font-mono text-xs leading-6 text-pixa-secondary">
                    GET {API_BASE}/search?q=…
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-pixa-muted">Inspect</dt>
                  <dd className="mt-1.5 break-all font-mono text-xs leading-6 text-pixa-secondary">
                    GET {API_BASE}/services/:id
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-pixa-muted">
                    Register
                  </dt>
                  <dd className="mt-1.5 break-all font-mono text-xs leading-6 text-pixa-secondary">
                    POST {API_BASE}/services
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.section>
      </div>

      <footer className="relative z-10 border-t border-white/10 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs text-pixa-secondary">
          <p>
            Pixa Registry — agent-native discovery for{" "}
            <span className="font-mono">x402</span> machine-payable APIs.
          </p>
          <a
            href={REGISTRY_BASE}
            target="_blank"
            rel="noreferrer"
            className="font-mono transition hover:text-pixa-white"
          >
            pixaregistry.vercel.app
          </a>
        </div>
      </footer>
    </main>
  );
}

function ServiceCard({
  card,
  index,
}: {
  card: AgentResultCard;
  index: number;
}) {
  return (
    <motion.article
      className="edge-frame group relative flex flex-col border border-white/12 bg-white/[0.025] p-6 shadow-silver"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * Math.min(index, 10), duration: 0.7, ease: EASE }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium leading-6 text-pixa-white">
          {card.name}
        </p>
        <TierBadge tier={card.trustTier} />
      </div>
      <p className="mt-2 break-all font-mono text-xs leading-6 text-pixa-muted">
        <span className="text-pixa-secondary">{card.method}</span>{" "}
        {card.resourceUrl}
      </p>
      <p className="mt-3 text-sm leading-7 text-pixa-secondary">
        {card.shortDescription}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {card.labels.slice(0, 4).map((label) => (
          <code
            key={label}
            className="border border-white/10 px-2 py-1 text-[0.65rem] leading-none text-pixa-muted"
          >
            {label}
          </code>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="min-w-0">
          <p className="font-mono text-sm text-pixa-white">
            {card.priceDisplay ?? "price via 402"}
          </p>
          <p className="mt-1 truncate text-[0.65rem] uppercase text-pixa-muted">
            {card.paymentNetworks.map(shortNetwork).join(" · ") || "network via 402"}
          </p>
        </div>
        <a
          href={`${REGISTRY_BASE}/service/${encodeURIComponent(card.serviceId)}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 border border-white/12 px-3 py-2 text-[0.65rem] uppercase leading-none text-pixa-secondary transition hover:border-white/30 hover:text-pixa-white"
        >
          Trust report
        </a>
      </div>
    </motion.article>
  );
}

// ── Registration wizard ───────────────────────────────────────────────────────

const STEPS = ["Endpoint", "Metadata", "Payment", "Verify"] as const;
const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

const VERIFY_STAGES = [
  "Checking endpoint reachability…",
  "Requesting x402 payment challenge…",
  "Validating payment requirements…",
  "Comparing declared vs advertised terms…",
  "Checking response schema…",
  "Computing trust scores…",
];

type FormState = {
  resourceUrl: string;
  method: string;
  name: string;
  description: string;
  category: string;
  tags: string;
  network: string;
  payTo: string;
  priceDisplay: string;
  priceAtomic: string;
  token: string;
  facilitator: string;
};

const initialForm: FormState = {
  resourceUrl: "",
  method: "GET",
  name: "",
  description: "",
  category: "",
  tags: "",
  network: "",
  payTo: "",
  priceDisplay: "",
  priceAtomic: "",
  token: "",
  facilitator: "",
};

const inputCls =
  "h-12 w-full border border-white/12 bg-white/[0.02] px-4 text-sm text-pixa-white placeholder:text-pixa-muted focus:border-white/30 focus:outline-none";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase text-pixa-secondary">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-pixa-muted">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

function ScoreRow({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="uppercase text-pixa-muted">{label}</span>
        <span className="font-mono text-pixa-secondary">
          {value === null ? "—" : `${Math.round(value * 100)}%`}
        </span>
      </div>
      <div className="mt-1.5 h-1 bg-white/[0.06]">
        <div
          className="h-1 bg-white/60 transition-all duration-700"
          style={{ width: `${Math.round((value ?? 0) * 100)}%` }}
        />
      </div>
    </div>
  );
}

function RegisterWizard({
  categories,
  networks,
  onRegistered,
}: {
  categories: string[];
  networks: NetworkInfo[];
  onRegistered: () => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!submitting) return;
    setStageIdx(0);
    stageTimer.current = setInterval(() => {
      setStageIdx((i) => Math.min(i + 1, VERIFY_STAGES.length - 1));
    }, 1200);
    return () => {
      if (stageTimer.current) clearInterval(stageTimer.current);
    };
  }, [submitting]);

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const urlValid = /^https?:\/\/.+\..+/.test(form.resourceUrl.trim());

  async function submit() {
    setSubmitting(true);
    setError(null);
    const payload: Record<string, unknown> = {
      resourceUrl: form.resourceUrl.trim(),
      method: form.method,
    };
    if (form.name.trim()) payload.name = form.name.trim();
    if (form.description.trim()) payload.description = form.description.trim();
    if (form.category.trim()) payload.category = form.category.trim();
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length) payload.tags = tags;
    if (form.network) payload.paymentNetworks = [form.network];
    if (form.payTo.trim()) payload.payTo = form.payTo.trim();
    if (form.priceDisplay.trim()) payload.priceDisplay = form.priceDisplay.trim();
    if (form.priceAtomic.trim()) payload.priceAtomic = form.priceAtomic.trim();
    if (form.token.trim()) payload.token = form.token.trim();
    if (form.facilitator.trim()) payload.facilitator = form.facilitator.trim();

    try {
      const res = await fetch(`${API_BASE}/services?verify=true`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => null)) as
        | (SubmitResponse & { error?: string; issues?: unknown[] })
        | null;
      if (!res.ok || !body || "error" in (body ?? {})) {
        const message =
          body && typeof body.error === "string"
            ? body.issues
              ? `${body.error}: ${JSON.stringify(body.issues).slice(0, 240)}`
              : body.error
            : `Registry responded ${res.status}`;
        throw new Error(message);
      }
      setResult(body);
      onRegistered();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setForm(initialForm);
    setStep(0);
    setResult(null);
    setError(null);
  }

  const scores = result?.verification?.scores ?? result?.service.scores ?? null;

  return (
    <motion.section
      id="register"
      className="mt-24 scroll-mt-28"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.85, ease: EASE }}
    >
      <p className="section-kicker">For Sellers</p>
      <h2 className="display-type mt-4 text-3xl leading-tight text-pixa-white sm:text-5xl">
        Register your API
      </h2>
      <p className="section-copy mt-6 max-w-3xl">
        List any x402-gated endpoint. Only the URL is required — the registry
        probes the live 402 challenge and fills in price, token, and network
        for you, then verifies and trust-scores the listing on the spot.
      </p>

      <div className="edge-frame mt-10 border border-white/12 bg-white/[0.02] p-7 sm:p-9">
        {result ? (
          <div>
            <p className="section-kicker">
              {result.created ? "Listing created" : "Listing updated"}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <h3 className="display-type text-2xl text-pixa-white">
                {result.service.name}
              </h3>
              {scores ? <TierBadge tier={scores.tier} /> : null}
            </div>
            <p className="mt-2 break-all font-mono text-xs text-pixa-muted">
              {result.service.resourceUrl}
            </p>

            {scores ? (
              <>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <ScoreRow label="Operational" value={scores.operational} />
                  <ScoreRow label="Schema" value={scores.schema} />
                  <ScoreRow label="Domain" value={scores.domain} />
                  <ScoreRow label="Reliability" value={scores.reliability} />
                  <ScoreRow label="Uptime" value={scores.uptime} />
                  <ScoreRow label="Community" value={scores.community} />
                </div>
                <div className="mt-7 flex flex-wrap gap-1.5">
                  {scores.labels.map((label) => (
                    <code
                      key={label}
                      className="border border-white/10 px-2 py-1 text-[0.65rem] leading-none text-pixa-secondary"
                    >
                      {label}
                    </code>
                  ))}
                </div>
              </>
            ) : null}

            {result.verification?.warnings.length ? (
              <div className="mt-7 border border-white/12 bg-white/[0.02] p-5">
                <p className="text-xs uppercase text-pixa-muted">Warnings</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-pixa-secondary">
                  {result.verification.warnings.map((w, i) => (
                    <li key={i}>— {w}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={`${REGISTRY_BASE}/service/${encodeURIComponent(result.service.serviceId)}`}
                target="_blank"
                rel="noreferrer"
                className="chrome-button inline-flex h-11 items-center rounded-sm px-5 text-xs font-medium uppercase"
              >
                View full trust report
              </a>
              <button
                onClick={reset}
                className="inline-flex h-11 items-center border border-white/12 px-5 text-xs uppercase text-pixa-secondary transition hover:border-white/30 hover:text-pixa-white"
              >
                Register another
              </button>
            </div>
          </div>
        ) : submitting ? (
          <div className="py-6">
            <p className="section-kicker">Verifying live</p>
            <ol className="mt-7 grid gap-3">
              {VERIFY_STAGES.map((stage, i) => (
                <li
                  key={stage}
                  className={`flex items-center gap-3 text-sm leading-7 transition ${
                    i < stageIdx
                      ? "text-pixa-muted"
                      : i === stageIdx
                        ? "text-pixa-white"
                        : "text-pixa-muted/50"
                  }`}
                >
                  <span className="font-mono text-xs">
                    {i < stageIdx ? "✓" : i === stageIdx ? "▸" : "·"}
                  </span>
                  {stage}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-2">
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  onClick={() => i < step && setStep(i)}
                  className={`border px-4 py-2 text-[0.68rem] uppercase leading-none transition ${
                    i === step
                      ? "border-white/40 text-pixa-white"
                      : i < step
                        ? "border-white/20 text-pixa-secondary hover:border-white/30"
                        : "border-white/10 text-pixa-muted"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} · {s}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6">
              {step === 0 ? (
                <>
                  <Field
                    label="Endpoint URL"
                    hint="The x402-gated resource agents will pay to call."
                  >
                    <input
                      className={inputCls}
                      value={form.resourceUrl}
                      onChange={set("resourceUrl")}
                      placeholder="https://api.example.com/data"
                      autoComplete="off"
                    />
                  </Field>
                  <Field label="HTTP method">
                    <div className="flex flex-wrap gap-2">
                      {METHODS.map((m) => (
                        <button
                          key={m}
                          onClick={() => setForm((f) => ({ ...f, method: m }))}
                          className={`border px-4 py-2.5 font-mono text-xs leading-none transition ${
                            form.method === m
                              ? "border-white/40 text-pixa-white"
                              : "border-white/10 text-pixa-secondary hover:border-white/24"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </Field>
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Name" hint="Optional — derived from the URL if omitted.">
                      <input
                        className={inputCls}
                        value={form.name}
                        onChange={set("name")}
                        placeholder="Acme — Live FX Rates"
                      />
                    </Field>
                    <Field label="Category" hint="weather, fx, crypto, otp, company…">
                      <input
                        className={inputCls}
                        value={form.category}
                        onChange={set("category")}
                        placeholder="weather"
                        list="registry-categories"
                      />
                      <datalist id="registry-categories">
                        {categories.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea
                      className={`${inputCls} h-28 resize-none py-3`}
                      value={form.description}
                      onChange={set("description")}
                      placeholder="What does this API return, and for whom?"
                    />
                  </Field>
                  <Field label="Tags" hint="Comma-separated.">
                    <input
                      className={inputCls}
                      value={form.tags}
                      onChange={set("tags")}
                      placeholder="fx, rates, live"
                    />
                  </Field>
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <p className="text-sm leading-7 text-pixa-secondary">
                    All payment fields are optional — the registry reads the
                    live 402 challenge and adopts whatever your endpoint
                    advertises. Declare values only if you want mismatch
                    checks against the challenge.
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Payment network">
                      <select
                        className={inputCls}
                        value={form.network}
                        onChange={set("network")}
                      >
                        <option value="">Auto-detect from 402</option>
                        {networks.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.displayName}
                            {n.isTestnet ? " (testnet)" : ""}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Token">
                      <input
                        className={inputCls}
                        value={form.token}
                        onChange={set("token")}
                        placeholder="USDC"
                      />
                    </Field>
                    <Field label="Display price">
                      <input
                        className={inputCls}
                        value={form.priceDisplay}
                        onChange={set("priceDisplay")}
                        placeholder="$0.001 USDC"
                      />
                    </Field>
                    <Field label="Atomic price" hint="Base units, e.g. 1000 = 0.001 USDC.">
                      <input
                        className={inputCls}
                        value={form.priceAtomic}
                        onChange={set("priceAtomic")}
                        placeholder="1000"
                      />
                    </Field>
                  </div>
                  <Field label="Pay-to address">
                    <input
                      className={inputCls}
                      value={form.payTo}
                      onChange={set("payTo")}
                      placeholder="Receiving wallet address"
                    />
                  </Field>
                  <Field label="Facilitator URL">
                    <input
                      className={inputCls}
                      value={form.facilitator}
                      onChange={set("facilitator")}
                      placeholder="https://facilitator.goplausible.xyz"
                    />
                  </Field>
                </>
              ) : null}

              {step === 3 ? (
                <div>
                  <p className="text-sm leading-7 text-pixa-secondary">
                    Submitting runs live verification: reachability, the x402
                    challenge, schema checks, and trust scoring. Results appear
                    in the catalog immediately.
                  </p>
                  <dl className="mt-6 grid gap-3 border border-white/10 bg-white/[0.015] p-5 text-sm sm:grid-cols-2">
                    {[
                      ["Endpoint", `${form.method} ${form.resourceUrl.trim()}`],
                      ["Name", form.name.trim() || "(auto)"],
                      ["Category", form.category.trim() || "(none)"],
                      [
                        "Network",
                        form.network ? shortNetwork(form.network) : "(auto-detect)",
                      ],
                      ["Price", form.priceDisplay.trim() || "(from 402)"],
                      ["Pay to", form.payTo.trim() || "(from 402)"],
                    ].map(([k, v]) => (
                      <div key={k} className="min-w-0">
                        <dt className="text-xs uppercase text-pixa-muted">{k}</dt>
                        <dd className="mt-1 break-all font-mono text-xs leading-6 text-pixa-secondary">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="mt-6 border border-white/15 bg-white/[0.02] p-4 text-sm leading-6 text-pixa-secondary">
                Registration failed — {error}
              </p>
            ) : null}

            <div className="mt-9 flex items-center justify-between gap-4">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex h-11 items-center border border-white/12 px-5 text-xs uppercase text-pixa-secondary transition enabled:hover:border-white/30 enabled:hover:text-pixa-white disabled:opacity-30"
              >
                Back
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!urlValid}
                  className="chrome-button inline-flex h-11 items-center rounded-sm px-6 text-xs font-medium uppercase disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={!urlValid}
                  className="chrome-button inline-flex h-11 items-center rounded-sm px-6 text-xs font-medium uppercase disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit & verify
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
