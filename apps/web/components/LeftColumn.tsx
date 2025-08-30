import TradingTable from './TradingTable';

export default function LeftColumn() {
  return (
    <div className="h-full bg-white p-3">
      <TradingTable />
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Left Column</h2>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-sm text-gray-600">Content area 1</p>
        </div>
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-sm text-gray-600">Content area 2</p>
        </div>
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-sm text-gray-600">Content area 3</p>
        </div>
      </div>
    </div>
  );
}
