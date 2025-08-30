export default function RightColumn() {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Order Form Section */}
      <div className="p-2 border-b border-gray-200">
        <h3 className="text-md font-semibold text-gray-900 mb-2">Place Order</h3>
        
        <div className="space-y-2">
          {/* Order Type Selection */}
          <div className="flex space-x-2">
            <button className="flex-1 py-1 px-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
              Buy
            </button>
            <button className="flex-1 py-1 px-3 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
              Sell
            </button>
          </div>

          {/* Order Form Fields */}
          <div className="space-y-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volume (Lots)</label>
              <input 
                type="number" 
                placeholder="0.01" 
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input 
                type="number" 
                placeholder="1.0856" 
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stop Loss and Take Profit */}
          <div className="space-y-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stop Loss</label>
              <input 
                type="number" 
                placeholder="1.0800" 
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Take Profit</label>
              <input 
                type="number" 
                placeholder="1.0900" 
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-md p-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Spread:</span>
              <span className="text-gray-900 font-medium">2 pips</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Commission:</span>
              <span className="text-gray-900 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-gray-700">Total:</span>
              <span className="text-gray-900">$0.00</span>
            </div>
          </div>

          {/* Place Order Button */}
          <button className="w-full py-1 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
            Place Order
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-2">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Actions</h3>
        <div className="space-y-1">
          <div className="bg-orange-50 rounded-md p-2 border border-orange-200">
            <p className="text-sm text-orange-700">Close All</p>
          </div>
          <div className="bg-red-50 rounded-md p-2 border border-red-200">
            <p className="text-sm text-red-700">Emergency Stop</p>
          </div>
        </div>
      </div>
    </div>
  );
}
