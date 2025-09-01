import { AssetData, OpenTradesTypes } from "./types/main";

export const mockAccount = {
  balance : {
    USD : 10000
  },
  usedMargin: 0
};

export const Assets: AssetData[] = [
  { symbol: "BTCUSDT", buy: 4500000, sell: 4501000, decimal: 2, status: "up" },
  { symbol: "SOLUSDT", buy: 9500, sell: 9510, decimal: 2, status: "up" },
  { symbol: "ETHUSDT", buy: 280000, sell: 280100, decimal: 2, status: "up" },
];

export const OpenTrades: OpenTradesTypes[] = [];

