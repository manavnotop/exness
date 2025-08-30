'use client';

import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

interface CandlestickData {
  time: UTCTimestamp; // Use the proper time type from lightweight-charts
  open: number;
  high: number;
  low: number;
  close: number;
}

// Interface for the API response
interface APICandle {
  time: string | number;
  open: string | number;
  high: string | number;
  low: string | number;
  close: string | number;
  quantity_total?: string | number;
  volume?: string | number;
  trade_count?: string;
}

interface APIResponse {
  symbol: string;
  interval: string;
  candles: APICandle[];
}

export default function Chart({ symbol = 'EUR/USD' }: { symbol?: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: 'rgba(33, 56, 77, 1)',
      },
      grid: {
        vertLines: { color: 'rgba(197, 203, 206, 0.5)' },
        horzLines: { color: 'rgba(197, 203, 206, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 12, // Much more spacing between bars
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        visible: true,
        rightOffset: 40, // Much more space on the right
        minBarSpacing: 8, // Higher minimum spacing
        // Reduce label density
        ticksVisible: true,
        // Custom time formatter that shows shorter labels
        tickMarkFormatter: (time: UTCTimestamp) => {
          const date = new Date(time * 1000);
          const now = new Date();
          const diffHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
          
          // Show different formats based on time difference to reduce clutter
          if (diffHours < 24) {
            // For same day, show only time (shorter format)
            return date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          } else {
            // For older dates, show date only (shorter format)
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
          }
        },
      },
      // Add left price scale configuration for better alignment
      leftPriceScale: {
        visible: true,
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      // Add right price scale configuration
      rightPriceScale: {
        visible: false, // Hide right price scale to save space
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (!chartContainerRef.current) return;
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Fetch and update chart data
  useEffect(() => {
    console.log('🔄 Chart useEffect triggered - Symbol changed to:', symbol);
    
    const fetchData = async () => {
      if (!seriesRef.current) {
        console.log('❌ Series not ready, skipping fetch');
        return;
      }

      console.log('📡 Fetching data for symbol:', symbol);
      setIsLoading(true);
      setError(null);

      try {
        const url = `http://localhost:8001/candles?symbol=${encodeURIComponent(symbol)}&interval=1-minute&limit=100`;
        console.log('🌐 API URL:', url);
        
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data: APIResponse = await response.json();
        console.log('📊 Raw API response:', data);
        console.log('📈 Number of candles received:', data.candles?.length || 0);

        if (!data.candles || data.candles.length === 0) {
          console.log('⚠️ No candles data received for symbol:', symbol);
          setError(`No data available for ${symbol}`);
          return;
        }

        // Filter and sample data to reduce overcrowding
        const filterData = (candles: APICandle[], maxPoints: number = 50) => {
          if (candles.length <= maxPoints) return candles;
          
          const step = Math.ceil(candles.length / maxPoints);
          const filtered: APICandle[] = [];
          
          for (let i = 0; i < candles.length; i += step) {
            const candle = candles[i];
            if (candle) {
              filtered.push(candle);
            }
          }
          
          // Always include the last candle
          const lastCandle = candles[candles.length - 1];
          if (lastCandle && filtered[filtered.length - 1] !== lastCandle) {
            filtered.push(lastCandle);
          }
          
          return filtered;
        };

        const filteredCandles = filterData(data.candles, 50); // Limit to 50 data points
        console.log('🔍 Filtered candles count:', filteredCandles.length);

        const chartData: CandlestickData[] = filteredCandles.map((candle: APICandle) => {
          // Debug: log the raw time value
          console.log('🕐 Raw candle time:', candle.time, 'Type:', typeof candle.time);
          
          let timeValue: UTCTimestamp;

          if (typeof candle.time === 'string') {
            // ISO datetime string → convert to UNIX seconds
            const date = new Date(candle.time);
            timeValue = Math.floor(date.getTime() / 1000) as UTCTimestamp;
            console.log('📅 String time converted:', candle.time, '→', date, '→', timeValue);
          } else if (typeof candle.time === 'number') {
            // Already UNIX timestamp → assume in seconds
            timeValue = candle.time as UTCTimestamp;
            console.log('⏰ Number time:', candle.time, '→', timeValue);
          } else {
            // Fallback
            const date = new Date(candle.time);
            timeValue = Math.floor(date.getTime() / 1000) as UTCTimestamp;
            console.log('🔄 Fallback time converted:', candle.time, '→', date, '→', timeValue);
          }

          return {
            time: timeValue,
            open: parseFloat(candle.open as string),
            high: parseFloat(candle.high as string),
            low: parseFloat(candle.low as string),
            close: parseFloat(candle.close as string),
          };
        });

        // Sort data by time to ensure proper ordering
        chartData.sort((a, b) => a.time - b.time);

        // Optional: check for duplicates before feeding into chart
        console.log('📊 Final chart data count:', chartData.length);
        console.log('🕐 Chart times:', chartData.map(d => new Date(d.time * 1000).toLocaleString()));

        console.log('🎯 Setting chart data for symbol:', symbol);
        
        // Clear existing data before setting new data
        seriesRef.current.setData([]);
        
        // Set the new data
        seriesRef.current.setData(chartData);
        console.log('✅ Chart data updated successfully');
        
      } catch (err) {
        console.error('❌ Error fetching chart data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 60000);
    return () => {
      console.log('🧹 Cleaning up interval for symbol:', symbol);
      clearInterval(interval);
    };
  }, [symbol]);

  return (
    <div className="relative w-full h-full">
      <div ref={chartContainerRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <div className="text-red-500 text-center">
            <div>Error loading chart</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}
