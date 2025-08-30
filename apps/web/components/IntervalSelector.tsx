'use client';

interface IntervalSelectorProps {
  selectedInterval: string;
  onIntervalChange: (interval: string) => void;
}

const AVAILABLE_INTERVALS = [
  { value: "1-minute", label: "1m" },
  { value: "5-minutes", label: "5m" },
  { value: "15-minutes", label: "15m" },
  { value: "1-hour", label: "1h" },
  { value: "24-hours", label: "1d" },
];

export default function IntervalSelector({ selectedInterval, onIntervalChange }: IntervalSelectorProps) {
  return (
    <select 
      className="text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded px-2 py-1 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={selectedInterval}
      onChange={(e) => onIntervalChange(e.target.value)}
    >
      {AVAILABLE_INTERVALS.map((interval) => (
        <option key={interval.value} value={interval.value}>
          {interval.label}
        </option>
      ))}
    </select>
  );
}
