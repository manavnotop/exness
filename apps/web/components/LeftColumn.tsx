"use client";

import TradingTable from './TradingTable';
import { useWebSocket } from '../hooks/useWebSocket';

export default function LeftColumn() {
  // Initialize WebSocket connection
  useWebSocket();

  return (
    <div className="h-full bg-white p-3">
      {/* <ConnectionStatus /> */}
      <TradingTable />
    </div>
  );
}
