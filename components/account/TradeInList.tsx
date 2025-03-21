'use client';

type TradeInItem = {
  date: string;
  quoteRef: string;
  status: string;
  total: string;
};

const mockData: TradeInItem[] = [
  { date: '18/03/2025', quoteRef: 'UQ703146', status: 'Awaiting Collection', total: '£488.00' },
  { date: '18/03/2025', quoteRef: 'UQ703144', status: 'Awaiting Collection', total: '£488.00' },
  { date: '18/03/2025', quoteRef: 'UQ703142', status: 'Awaiting Collection', total: '£734.00' },
  { date: '18/02/2025', quoteRef: 'UQ655910', status: 'Quote Cancelled', total: 'Cancelled' },
];

export default function TradeInTable() {
  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold text-center text-[#2d4d9c] mb-4">My Trade In</h2>

      <div className="overflow-x-auto">
        {mockData?.length > 0 ? (
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">DATE</th>
                <th className="px-4 py-2 border">QUOTE REF</th>
                <th className="px-4 py-2 border">STATUS</th>
                <th className="px-4 py-2 border">TOTAL</th>
                <th className="px-4 py-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item, index) => (
                <tr key={index} className="text-left border">
                  <td className="px-4 py-2 border">{item.date || '-'}</td>
                  <td className="px-4 py-2 border">{item.quoteRef || '-'}</td>
                  <td className="px-4 py-2 border">{item.status || '-'}</td>
                  <td className="px-4 py-2 border">{item.total || '-'}</td>
                  <td className="px-4 py-2 border text-center">
                    <button className="btn btn-primary">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 py-4">No trade-in records found.</p>
        )}
      </div>

      {/* Footer Text */}
      <p className="text-sm text-center mt-4 text-gray-600">
        We hope you like our new Trade In section of our website. We're still working on improvements,
        but if you spot something that’s not working as expected, please send us an email with
        screenshots (if possible) to <a href="mailto:websitefeedback@parkcameras.com" className="text-blue-600">websitefeedback@parkcameras.com</a>.
        If you have a query, please email <a href="mailto:sales@parkcameras.com" className="text-blue-600">sales@parkcameras.com</a>.
      </p>
    </div>
  );
}
