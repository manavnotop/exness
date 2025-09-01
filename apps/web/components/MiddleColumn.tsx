'use client';

import { useState } from 'react';
import Chart from './Chart';
import SymbolSelector from './SymbolSelector';
import IntervalSelector from './IntervalSelector';
import OrdersTable from './OrdersTable';

export default function MiddleColumn() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedInterval, setSelectedInterval] = useState('1-minute');

  const handleSymbolChange = (newSymbol: string) => {
    setSelectedSymbol(newSymbol);
  };

  const handleIntervalChange = (newInterval: string) => {
    setSelectedInterval(newInterval);
  };


  return (
    <div className="h-full bg-white flex flex-col">
      {/* Chart Section */}
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-3">
            <SymbolSelector 
              selectedSymbol={selectedSymbol} 
              onSymbolChange={handleSymbolChange} 
            />
            <IntervalSelector
              selectedInterval={selectedInterval}
              onIntervalChange={handleIntervalChange}
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm">
              <span className="text-gray-500">Bid: </span>
              <span className="text-green-600 font-mono font-semibold">1.0854</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Ask: </span>
              <span className="text-red-600 font-mono font-semibold">1.0856</span>
            </div>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="w-full h-[32rem] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <Chart symbol={selectedSymbol} interval={selectedInterval} />
        </div>
      </div>

            {/* Orders Table Section */}
      <OrdersTable />
    </div>
  );
}
