"use client";

import { useTradingStore } from '../store/tradingStore';

// Helper function to format price with appropriate decimals
const formatPrice = (price: number, symbol: string): string => {
  // Crypto pairs typically need more precision
  if (symbol.includes('USDT') || symbol.includes('BTC') || symbol.includes('ETH')) {
    return price.toFixed(2); // 2 decimals for crypto
  }
  // Forex pairs typically use 4-5 decimals
  if (symbol.includes('/')) {
    return price.toFixed(4); // 4 decimals for forex
  }
  // Default to 2 decimals
  return price.toFixed(2);
};

export default function TradingTable() {
  const { tradingData, isConnected, error, getAllSymbols } = useTradingStore();
  const symbols = getAllSymbols();


  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
        <p className="text-red-600 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
        <p className="text-yellow-600 text-sm">Connecting to WebSocket...</p>
      </div>
    );
  }

  if (symbols.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
        <p className="text-gray-600 text-sm">Waiting for data...</p>
        <p className="text-xs text-gray-500 mt-1">Connected: {isConnected ? 'Yes' : 'No'}</p>
        <p className="text-xs text-gray-500">Store size: {tradingData.size}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Live Prices</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-1 font-medium text-gray-600" style={{ width: '25%' }}>
                Symbol
              </th>
              <th className="text-center py-1 font-medium text-gray-600" style={{ width: '15%' }}>
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
            {symbols.map((symbol) => {
              const data = tradingData.get(symbol);
              if (!data) return null;
              
              return (
                <tr key={`${symbol}-${data.timestamp}`} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-1 text-gray-900 font-medium">
                    {symbol}
                  </td>
                  <td className="py-1 text-center">
                    {data.signal === 'up' ? (
                      <span className="text-green-600 font-bold">▲</span>
                    ) : data.signal === 'down' ? (
                      <span className="text-red-600 font-bold">▼</span>
                    ) : (
                      <span className="text-gray-400">─</span>
                    )}
                  </td>
                  <td className="py-1 text-right">
                    <span className="text-gray-900 font-mono">
                      {formatPrice(data.bid, symbol)}
                    </span>
                  </td>
                  <td className="py-1 text-right">
                    <span className="text-gray-900 font-mono">
                      {formatPrice(data.ask, symbol)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
