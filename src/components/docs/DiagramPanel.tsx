type DiagramPanelProps = {
  title: string;
  nodes: string[];
};

export function DiagramPanel({ title, nodes }: DiagramPanelProps) {
  return (
    <div className="edge-frame border border-white/12 bg-white/[0.02] p-6">
      <p className="section-kicker">{title}</p>
      <div className="mt-7 grid gap-3 md:grid-cols-3">
        {nodes.map((node, index) => (
          <div key={node} className="relative border border-white/10 p-4">
            <span className="display-type text-xs text-pixa-muted">
              0{index + 1}
            </span>
            <p className="display-type mt-5 text-2xl uppercase leading-tight text-pixa-white">
              {node}
            </p>
            {index < nodes.length - 1 ? (
              <div className="absolute -right-3 top-1/2 hidden h-px w-6 silver-line md:block" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
