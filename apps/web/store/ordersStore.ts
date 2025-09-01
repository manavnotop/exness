import { create } from 'zustand';

export interface Order {
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

interface OrdersStore {
  // State
  orders: Order[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchOrders: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  // Initial state
  orders: [],
  loading: false,
  error: null,
  
  // Actions
  fetchOrders: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('http://localhost:8001/orders/get-orders');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const orders = await response.json();
      set({ orders, loading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders', 
        loading: false 
      });
    }
  },
  
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
  
  clearError: () => {
    set({ error: null });
  },
}));
