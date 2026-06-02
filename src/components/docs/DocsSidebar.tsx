import Image from "next/image";
import Link from "next/link";

const nav = [
  ["Overview", "#overview"],
  ["Install", "#install"],
  ["Claude Desktop", "#claude-desktop"],
  ["Custom Agents", "#custom-agents"],
  ["Environment", "#environment"],
  ["Tools", "#tools"],
  ["Live Demo", "#live-demo"],
  ["Security", "#security"],
  ["Algorand", "#algorand"],
  ["Roadmap", "#roadmap"],
];

export function DocsSidebar() {
  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-white/10">
      <div className="flex h-full flex-col gap-8 px-5 py-6 sm:px-8">
        <Link href="/" aria-label="Pixa home" className="block w-32">
          <Image
            src="/assets/logo.png"
            alt="Pixa Wallet"
            width={4800}
            height={3200}
            className="h-auto w-full"
            priority
          />
        </Link>
        <nav className="flex gap-3 overflow-x-auto pb-3 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 border border-white/10 px-4 py-3 text-xs uppercase leading-none text-pixa-secondary transition hover:border-white/24 hover:text-pixa-white lg:border-0 lg:border-t lg:px-0 lg:py-4"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="/assets/pixa.mcpb"
          download
          className="chrome-button mt-auto hidden h-12 items-center justify-center rounded-sm px-5 text-xs font-medium uppercase lg:inline-flex"
        >
          Download MCP Bundle
        </a>
      </div>
    </aside>
  );
}
