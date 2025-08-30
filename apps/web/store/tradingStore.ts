import { create } from 'zustand';

export interface TradingData {
  symbol: string;
  bid: number;
  ask: number;
  lastPrice: number;
  signal: 'up' | 'down' | 'neutral';
  timestamp: number;
}

interface TradingStore {
  // State
  tradingData: Map<string, TradingData>;
  isConnected: boolean;
  error: string | null;
  
  // Actions
  updatePrice: (symbol: string, bid: number, ask: number) => void;
  setConnectionStatus: (status: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed values
  getSymbolData: (symbol: string) => TradingData | undefined;
  getAllSymbols: () => string[];
}

export const useTradingStore = create<TradingStore>((set, get) => ({
  // Initial state
  tradingData: new Map(),
  isConnected: false,
  error: null,
  
  // Actions
  updatePrice: (symbol: string, bid: number, ask: number) => {
    set((state) => {
      const currentData = state.tradingData.get(symbol);
      
      // Only update if price actually changed (prevents unnecessary re-renders)
      if (currentData && 
          Math.abs(currentData.bid - bid) < 0.000001 && 
          Math.abs(currentData.ask - ask) < 0.000001) {
        return state; // No change, return same state
      }
      
      const newData: TradingData = {
        symbol,
        bid,
        ask,
        lastPrice: currentData?.lastPrice || bid,
        signal: currentData ? 
          (bid > currentData.lastPrice ? 'up' : 
           bid < currentData.lastPrice ? 'down' : 'neutral') : 'neutral',
        timestamp: Date.now(),
      };
      
      const newTradingData = new Map(state.tradingData);
      newTradingData.set(symbol, newData);
      
      return { tradingData: newTradingData };
    });
  },
  
  setConnectionStatus: (status: boolean) => {
    set({ isConnected: status });
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  // Computed values
  getSymbolData: (symbol: string) => {
    return get().tradingData.get(symbol);
  },
  
  getAllSymbols: () => {
    return Array.from(get().tradingData.keys());
  },
}));
