type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  return (
    <div className="edge-frame overflow-hidden border border-white/12 bg-white/[0.025]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
        <span className="section-kicker">{language}</span>
        <span className="text-xs uppercase leading-none text-pixa-muted">Pixa</span>
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-pixa-secondary sm:p-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
