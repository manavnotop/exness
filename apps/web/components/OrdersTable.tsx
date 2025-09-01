'use client';

import { useEffect } from 'react';
import { useOrdersStore } from '../store/ordersStore';

interface Order {
  orderId: number;
  asset: string;
  type: 'Buy' | 'Sell';
  volume: number;
  open_price: number;
  current_price: number;
  pnl: number;
  stopLoss?: number | null;
  takeProfit?: number | null;
  margin: number;
}

export default function OrdersTable() {
  const { orders, loading, error, fetchOrders } = useOrdersStore();

  useEffect(() => {
    fetchOrders();
    // Refresh orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-600 text-sm">Error loading orders: {error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4">
        <div className="text-gray-500 text-sm text-center">No open orders</div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h3 className="text-md font-semibold text-gray-900 mb-2">Current Orders</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-1 font-medium text-gray-700">Symbol</th>
              <th className="text-left py-2 px-1 font-medium text-gray-700">Type</th>
              <th className="text-right py-2 px-1 font-medium text-gray-700">Volume</th>
              <th className="text-right py-2 px-1 font-medium text-gray-700">Open Price</th>
              <th className="text-right py-2 px-1 font-medium text-gray-700">Current Price</th>
              <th className="text-right py-2 px-1 font-medium text-gray-700">P/L</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.orderId} 
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  order.type === 'Buy' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <td className="py-2 px-1 font-medium text-gray-900">
                  {order.asset}
                </td>
                <td className="py-2 px-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    order.type === 'Buy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.type}
                  </span>
                </td>
                <td className="py-2 px-1 text-right font-mono text-gray-900">
                  {order.volume.toFixed(2)}
                </td>
                <td className="py-2 px-1 text-right font-mono text-gray-900">
                  {order.open_price.toFixed(4)}
                </td>
                <td className="py-2 px-1 text-right font-mono text-gray-900">
                  {order.current_price.toFixed(4)}
                </td>
                <td className={`py-2 px-1 text-right font-mono font-medium ${
                  order.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {order.pnl >= 0 ? '+' : ''}{order.pnl.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
