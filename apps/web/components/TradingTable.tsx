interface TradingData {
  symbol: string;
  signal: 'up' | 'down';
  bid: string;
  ask: string;
}

const sampleData: TradingData[] = [
  { symbol: 'EUR/USD', signal: 'up', bid: '1.0854', ask: '1.0856' },
  { symbol: 'GBP/USD', signal: 'down', bid: '1.2647', ask: '1.2649' },
  { symbol: 'USD/JPY', signal: 'up', bid: '149.23', ask: '149.25' },
  { symbol: 'USD/CHF', signal: 'down', bid: '0.8923', ask: '0.8925' },
  { symbol: 'AUD/USD', signal: 'up', bid: '0.6547', ask: '0.6549' },
];

export default function TradingTable() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Live Prices</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-1 font-medium text-gray-600" style={{ width: '30%' }}>
                Symbol
              </th>
              <th className="text-center py-1 font-medium text-gray-600" style={{ width: '10%' }}>
                Signal
              </th>
              <th className="text-right py-1 font-medium text-gray-600" style={{ width: '30%' }}>
                Bid
              </th>
              <th className="text-right py-1 font-medium text-gray-600" style={{ width: '30%' }}>
                Ask
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-1 text-gray-900 font-medium">
                  {item.symbol}
                </td>
                <td className="py-1 text-center">
                  {item.signal === 'up' ? (
                    <span className="text-green-600 font-bold">▲</span>
                  ) : (
                    <span className="text-red-600 font-bold">▼</span>
                  )}
                </td>
                <td className="py-1 text-right text-gray-900 font-mono">
                  {item.bid}
                </td>
                <td className="py-1 text-right text-gray-900 font-mono">
                  {item.ask}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
