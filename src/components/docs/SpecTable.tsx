type SpecTableProps = {
  columns: string[];
  rows: string[][];
};

export function SpecTable({ columns, rows }: SpecTableProps) {
  return (
    <div className="overflow-x-auto border border-white/12 bg-white/[0.02]">
      <table className="w-full min-w-[42rem] border-collapse text-left text-sm leading-7">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="border-b border-white/12 px-4 py-4 text-xs uppercase leading-none text-pixa-muted"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.join("-")}
              className="border-b border-white/8 last:border-b-0"
            >
              {row.map((cell) => (
                <td key={cell} className="px-4 py-4 align-top text-pixa-secondary">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
