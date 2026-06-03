import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DiagramPanel } from "@/components/docs/DiagramPanel";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { SpecTable } from "@/components/docs/SpecTable";

export const metadata: Metadata = {
  title: "Docs | Pixa Wallet",
  description:
    "Install and use Pixa Wallet, the MCP-native agentic payment wallet for Algorand and x402.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Docs | Pixa Wallet",
    description:
      "Install and use Pixa Wallet, the MCP-native agentic payment wallet for Algorand and x402.",
    url: "https://pixawallet.xyz/docs",
    images: [
      {
        url: "/assets/pixa-bg.png",
        width: 1200,
        height: 630,
        alt: "Pixa Wallet documentation",
      },
    ],
  },
};

const claudeConfig = `{
  "mcpServers": {
    "pixa": {
      "command": "npx",
      "args": ["-y", "pixa-wallet-mcp"],
      "env": {
        "ALGORAND_MNEMONIC": "your 25-word mnemonic here",
        "NETWORK": "algorand-mainnet",
        "MAX_PER_CALL": "0.10",
        "MAX_PER_DAY": "20.00"
      }
    }
  }
}`;

const langchainConfig = `from langchain_mcp import MCPToolkit

toolkit = MCPToolkit(
    server_command="npx",
    server_args=["-y", "pixa-wallet-mcp"],
    env={
        "ALGORAND_MNEMONIC": "your 25-word mnemonic",
        "NETWORK": "algorand-mainnet",
        "MAX_PER_CALL": "0.50",
        "MAX_PER_DAY": "50.00"
    }
)

tools = toolkit.get_tools()`;

export default function DocsPage() {
  return (
    <DocsLayout>
      <article className="mx-auto w-full max-w-5xl min-w-0">
        <section id="overview" className="scroll-mt-32 lg:scroll-mt-10">
          <p className="section-kicker">Documentation</p>
          <h1 className="chrome-text display-type docs-heading mt-6 text-balance">
            Pixa Wallet.
          </h1>
          <p className="section-copy mt-8 max-w-3xl">
            The first agentic payment wallet built for Algorand. Pixa lets
            agents discover, authorize, and settle x402 micropayments from
            Claude Desktop or custom agent frameworks.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 text-xs uppercase leading-none text-pixa-secondary">
            {["Algorand Mainnet", "MCP Native", "x402 Supported", "GPL v3"].map(
              (badge) => (
                <span key={badge} className="border border-white/12 px-4 py-2">
                  {badge}
                </span>
              ),
            )}
          </div>
        </section>

        <DocsSection id="install" title="Install" kicker="One click">
          <p>
            Download the `.mcpb` extension and double-click. Pixa installs into
            Claude Desktop without terminal work.
          </p>
          <a
            href="/assets/pixa.mcpb"
            download
            className="chrome-button mt-6 inline-flex h-12 items-center rounded-sm px-6 text-xs font-medium uppercase"
          >
            Download Latest Release
          </a>
        </DocsSection>

        <DocsSection id="claude-desktop" title="Claude Desktop" kicker="JSON">
          <p>
            Developers can add Pixa directly to the Claude Desktop MCP config.
            Restart Claude after saving.
          </p>
          <CodeBlock language="json" code={claudeConfig} />
        </DocsSection>

        <DocsSection id="custom-agents" title="Custom Agents" kicker="LangChain">
          <p>
            Use the MCP toolkit from LangChain or LangGraph and expose Pixa
            tools to your agent runtime.
          </p>
          <CodeBlock language="python" code={langchainConfig} />
        </DocsSection>

        <DocsSection id="environment" title="Environment" kicker="Config">
          <SpecTable
            columns={["Variable", "Required", "Default", "Description"]}
            rows={[
              ["ALGORAND_MNEMONIC", "Yes", "-", "25-word Algorand mnemonic"],
              ["NETWORK", "No", "algorand-mainnet", "Mainnet or testnet"],
              ["MAX_PER_CALL", "No", "0.10", "Max USDC per payment"],
              ["MAX_PER_DAY", "No", "20.00", "Daily spending cap"],
            ]}
          />
        </DocsSection>

        <DocsSection id="tools" title="Tools Reference" kicker="MCP">
          <div className="grid gap-5 md:grid-cols-3">
            <ToolGroup
              title="Wallet"
              items={[
                "check_balance",
                "transfer_usdc",
                "transfer_algo",
                "spending_report",
                "request_funding",
              ]}
            />
            <ToolGroup
              title="x402"
              items={["pay", "x402_fetch", "search_bazaar"]}
            />
            <ToolGroup title="DeFi" items={["tinyman_swap", "create_token"]} />
          </div>
        </DocsSection>

        <DocsSection id="live-demo" title="Live Demo" kicker="Unified Agent Layer">
          <p>
            Ask your agent to access the demo endpoint. Pixa handles the 402
            payment, confirms the transaction, retries the request, and returns
            the result.
          </p>
          <CodeBlock
            language="endpoint"
            code="https://unified-agent-layer-production.up.railway.app/v1/chat"
          />
          <DiagramPanel
            title="Payment Flow"
            nodes={[
              "Agent request",
              "402 required",
              "Budget check",
              "USDC auth",
              "Result",
            ]}
          />
        </DocsSection>

        <DocsSection id="security" title="Security Model" kicker="Controls">
          <DiagramPanel
            title="Autonomy Modes"
            nodes={["Full autonomous", "Session based", "Human approval"]}
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              "Budget limits",
              "Spending tracker",
              "NFD resolution",
              "Secure key storage",
              "Transaction finality",
              "Per-call audit trail",
            ].map((item) => (
              <div
                key={item}
                className="border border-white/10 p-4 leading-7 text-pixa-secondary"
              >
                {item}
              </div>
            ))}
          </div>
        </DocsSection>

        <DocsSection id="algorand" title="Why Algorand" kicker="Settlement">
          <SpecTable
            columns={["Capability", "Algorand", "EVM Chains"]}
            rows={[
              ["Finality", "~3.3 seconds", "12s+ probabilistic"],
              ["Fees", "< $0.001", "$0.50-$5.00+"],
              ["Atomic transactions", "Native", "Contract workaround"],
              ["Native USDC", "Yes", "Often bridged"],
              ["Micropayments", "Viable", "Gas exceeds value"],
            ]}
          />
        </DocsSection>

        <DocsSection id="repositories" title="Repositories" kicker="Source">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "Pixa Wallet",
                "soumyacodes007/Pixa",
                "https://github.com/soumyacodes007/Pixa",
              ],
              [
                "Pixa Website",
                "ogsamrat/PixaWeb",
                "https://github.com/ogsamrat/PixaWeb/",
              ],
            ].map(([label, repo, href]) => (
              <a
                key={repo}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="edge-frame block border border-white/12 bg-white/[0.02] p-5 transition duration-500 ease-cinematic hover:border-white/28 hover:bg-white/[0.045]"
              >
                <p className="section-kicker">{label}</p>
                <p className="mt-4 break-words font-mono text-sm leading-7 text-pixa-white">
                  {repo}
                </p>
              </a>
            ))}
          </div>
        </DocsSection>
      </article>
    </DocsLayout>
  );
}

function DocsSection({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-32 sm:mt-20 lg:mt-24 lg:scroll-mt-8">
      <p className="section-kicker">{kicker}</p>
      <h2 className="display-type mt-4 text-3xl leading-tight text-pixa-white sm:text-5xl">
        {title}
      </h2>
      <div className="mt-6 space-y-5 text-sm leading-7 text-pixa-secondary sm:mt-7 sm:space-y-6 sm:text-base sm:leading-8">
        {children}
      </div>
    </section>
  );
}

function ToolGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="edge-frame border border-white/12 bg-white/[0.02] p-5">
      <h3 className="display-type text-xl leading-tight text-pixa-white sm:text-2xl">
        {title}
      </h3>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <code
            key={item}
            className="break-words border-t border-white/10 pt-3 text-sm leading-6 text-pixa-secondary"
          >
            {item}
          </code>
        ))}
      </div>
    </article>
  );
}
