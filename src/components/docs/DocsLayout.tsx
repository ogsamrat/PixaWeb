import { DocsSidebar } from "@/components/docs/DocsSidebar";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-pixa-black text-pixa-white">
      <div className="vault-fallback fixed inset-0 opacity-25" />
      <div className="micro-grid fixed inset-0 opacity-20" />
      <div className="grain-overlay fixed" />
      <div className="relative lg:pl-72">
        <DocsSidebar />
        <div className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-16">
          {children}
        </div>
      </div>
    </main>
  );
}
