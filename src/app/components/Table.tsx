export default function Table({
  title,
  columns,
  data,
}: {
  title: string;
  columns: string[];
  data: any[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b font-semibold text-gray-800">
        {title}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-400"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {Object.values(row).map((cell: any, j) => (
                    <td key={j} className="px-6 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
