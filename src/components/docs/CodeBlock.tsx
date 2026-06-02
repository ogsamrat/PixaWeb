type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  return (
    <div className="edge-frame overflow-hidden border border-white/12 bg-white/[0.025]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
        <span className="section-kicker">{language}</span>
        <span className="text-[0.68rem] uppercase leading-none text-pixa-muted sm:text-xs">
          Pixa
        </span>
      </div>
      <pre className="max-w-full overflow-x-auto p-4 text-xs leading-6 text-pixa-secondary sm:p-6 sm:text-sm sm:leading-7">
        <code>{code}</code>
      </pre>
    </div>
  );
}
