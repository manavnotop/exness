'use client';

import { useState, useEffect } from 'react';

interface SymbolSelectorProps {
  selectedSymbol: string;
  onSymbolChange: (symbol: string) => void;
}

export default function SymbolSelector({ selectedSymbol, onSymbolChange }: SymbolSelectorProps) {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await fetch('http://localhost:8001/symbols');
        if (!response.ok) {
          throw new Error(`Failed to fetch symbols: ${response.status}`);
        }
        const data = await response.json();
        setSymbols(data.symbols);
      } catch (err) {
        console.error('Error fetching symbols:', err);
        setError(err instanceof Error ? err.message : 'Failed to load symbols');
        // Fallback to common symbols if API fails
        setSymbols(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSymbols();
  }, []);

  if (isLoading) {
    return (
      <select 
        className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none cursor-wait"
        disabled
      >
        <option>Loading...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select 
        className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none"
        value={selectedSymbol}
        onChange={(e) => onSymbolChange(e.target.value)}
      >
        {symbols.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
    );
  }

  return (
    <select 
      className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none cursor-pointer hover:bg-gray-50 rounded px-1"
      value={selectedSymbol}
      onChange={(e) => onSymbolChange(e.target.value)}
    >
      {symbols.map((symbol) => (
        <option key={symbol} value={symbol}>
          {symbol}
        </option>
      ))}
    </select>
  );
}
