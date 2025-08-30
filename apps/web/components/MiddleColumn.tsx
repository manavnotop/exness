export default function MiddleColumn() {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Chart Section */}
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">EUR/USD</h2>
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
        <div className="w-full h-[32rem] bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="text-2xl mb-2">📈</div>
            <p className="text-sm">Chart will be rendered here</p>
            <p className="text-xs text-gray-400">Using lightweight-charts</p>
          </div>
        </div>
      </div>

      {/* Current Orders Section */}
      <div className="p-2">
        <h3 className="text-md font-semibold text-gray-900 mb-2">Current Orders</h3>
        
        <div className="space-y-1">
          {/* Sample Running Orders */}
          <div className="bg-green-50 border border-green-200 rounded-md p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-green-900 text-sm">EUR/USD</div>
                  <div className="text-xs text-green-700">Buy • 0.1 lots</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-900 text-sm">1.0856</div>
                <div className="text-xs text-green-700">+$12.50</div>
              </div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-green-600">
              <span>SL: 1.0800</span>
              <span>TP: 1.0900</span>
              <span>Open: 2h ago</span>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-red-900 text-sm">GBP/USD</div>
                  <div className="text-xs text-red-700">Sell • 0.05 lots</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-red-900 text-sm">1.2647</div>
                <div className="text-xs text-red-700">-$8.75</div>
              </div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-red-600">
              <span>SL: 1.2700</span>
              <span>TP: 1.2600</span>
              <span>Open: 1h ago</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-blue-900 text-sm">USD/JPY</div>
                  <div className="text-xs text-blue-700">Buy • 0.2 lots</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-blue-900 text-sm">149.23</div>
                <div className="text-xs text-blue-700">+$25.00</div>
              </div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-blue-600">
              <span>SL: 148.80</span>
              <span>TP: 149.80</span>
              <span>Open: 30m ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
