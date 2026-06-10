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
  ["Repositories", "#repositories"],
  ["Registry", "/registry"],
];

export function DocsSidebar() {
  return (
    <aside className="sticky top-0 z-40 border-b border-white/10 bg-pixa-black/[0.92] backdrop-blur-xl lg:fixed lg:bottom-0 lg:left-0 lg:top-0 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-4 px-4 py-4 sm:px-6 lg:gap-8 lg:px-5 lg:py-6 xl:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Pixa home" className="block w-24 shrink-0 sm:w-28 lg:w-32">
            <Image
              src="/assets/logo.png"
              alt="Pixa Wallet"
              width={4800}
              height={3200}
              className="h-auto w-full"
              priority
            />
          </Link>
          <a
            href="/assets/pixa.mcpb"
            download
            className="chrome-button inline-flex h-10 shrink-0 items-center justify-center rounded-sm px-4 text-[0.68rem] font-medium uppercase lg:hidden"
          >
            Download
          </a>
        </div>
        <nav
          aria-label="Docs navigation"
          className="flex max-w-[calc(100vw-2rem)] gap-2 overflow-x-auto pb-2 lg:max-w-none lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
        >
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 border border-white/10 px-3 py-3 text-[0.68rem] uppercase leading-none text-pixa-secondary transition hover:border-white/24 hover:text-pixa-white sm:px-4 lg:border-0 lg:border-t lg:px-0 lg:py-4 lg:text-xs"
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
