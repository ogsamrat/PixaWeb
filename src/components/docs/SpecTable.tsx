type SpecTableProps = {
  columns: string[];
  rows: string[][];
};

export function SpecTable({ columns, rows }: SpecTableProps) {
  return (
    <div className="max-w-full overflow-x-auto border border-white/12 bg-white/[0.02]">
      <table className="w-full min-w-[36rem] border-collapse text-left text-xs leading-6 sm:min-w-[42rem] sm:text-sm sm:leading-7">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="border-b border-white/12 px-3 py-3 text-[0.68rem] uppercase leading-none text-pixa-muted sm:px-4 sm:py-4 sm:text-xs"
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
              className="border-b border-white/10 last:border-b-0"
            >
              {row.map((cell) => (
                <td
                  key={cell}
                  className="px-3 py-3 align-top text-pixa-secondary sm:px-4 sm:py-4"
                >
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
