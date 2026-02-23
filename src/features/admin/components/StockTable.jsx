import React from 'react';

const StockTable = ({ rows = [] }) => {
  if (!rows.length) {
    return <p className="text-sm text-gray-500">No stock data yet.</p>;
  }

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="border px-3 py-2 text-left">Item</th>
          <th className="border px-3 py-2 text-left">Qty</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="border px-3 py-2">{row.name}</td>
            <td className="border px-3 py-2">{row.qty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StockTable;
