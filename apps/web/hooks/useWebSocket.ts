"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useTradingStore } from '../store/tradingStore';

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const store = useTradingStore();

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket('ws://localhost:8080');
      wsRef.current = ws;

      ws.onopen = () => {
        store.setConnectionStatus(true);
        store.clearError();
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle connection confirmation message
          if (data.type === 'connection' && data.status === 'connected') {
            return;
          }
          
          // Handle different message types
          if (data.type === 'trade' && data.data) {
            // Binance data structure: { stream: 'btcusdt@aggTrade', data: { ... } }
            if (data.data.stream && data.data.data) {
              // Extract symbol from stream (e.g., 'btcusdt@aggTrade' -> 'BTCUSDT')
              const stream = data.data.stream;
              const symbol = stream.split('@')[0].toUpperCase();
              const tradeData = data.data.data;
              
              
              // Binance aggTrade data structure
              if (tradeData.s && tradeData.p) {
                const price = parseFloat(tradeData.p);
                //const quantity = parseFloat(tradeData.q);
                
                // Calculate bid/ask with a small spread (0.0001 for crypto)
                const spread = price * 0.0001;
                const bid = price - spread / 2;
                const ask = price + spread / 2;
                
                store.updatePrice(symbol, bid, ask);
              }
            } else if (data.data.s && data.data.p) {
              // Direct trade data structure (fallback)
              const symbol = data.data.s;
              const price = parseFloat(data.data.p);
              
              const spread = price * 0.0001;
              const bid = price - spread / 2;
              const ask = price + spread / 2;
              
              store.updatePrice(symbol, bid, ask);
            }
          } else {
            console.log('Received message with unexpected format:', data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          store.setError('Failed to parse incoming data');
        }
      };

      ws.onclose = (event) => {
        store.setConnectionStatus(false);
        
        // Only set error if it's not a normal closure
        if (event.code !== 1000) {
          store.setError(`WebSocket disconnected: ${event.reason || 'Unknown reason'}`);
        }
        
        // Attempt to reconnect after 3 seconds
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };

      ws.onerror = (event) => {
        // Handle WebSocket error event properly
        
        // Try to get more details about the error
        if (event instanceof ErrorEvent) {
          console.error('Error details:', event.message);
        } else if (event instanceof Event) {
          console.error('Event type:', event.type);
        }
        
        // Don't set error here as onclose will handle it
        // This prevents duplicate error messages
      };

    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      store.setError('Failed to connect to WebSocket server');
      
      // Attempt to reconnect after 5 seconds
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      }
    }
  }, []); // Remove dependencies to prevent recreation

  useEffect(() => {
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    // The useEffect will handle reconnection
  }, []);

  return { reconnect };
};
