"use client";

export default function DataTable({
  title,
  columns = [],
  data = [],
  actions = [],
}) {
  return (
    <div className="bg-[#1E1E1E] text-gray-300 rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">{title}</h2>

        {/* <input
          type="text"
          placeholder="Search..."
          className="bg-[#2A2A2A] px-4 py-2 rounded-lg text-sm outline-none"
        /> */}
      </div>

      {/* Table wrapper with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="text-left py-3">
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-left py-3">Hành động</th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-[#2A2A2A] transition"
              >
                {columns.map((col, i) => (
                  <td key={i} className="py-4">
                    {col.render ? col.render(row, index) : row[col.key]}
                  </td>
                ))}

                {actions.length > 0 && (
                  <td>
                    <div className="flex gap-3">
                      {actions.map((action, i) => {
                        const Icon = action.icon;
                        return (
                          <Icon
                            key={i}
                            title={action.label}
                            className={`w-4 h-4 cursor-pointer ${action.className}`}
                            onClick={() => action.onClick(row)}
                          />
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
