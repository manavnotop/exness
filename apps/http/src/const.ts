import { AssetData, OpenTradesTypes } from "./types/main";

export const mockAccount = {
  balance : {
    USD : 10000
  },
  usedMargin: 0
};

export const Assets: AssetData[] = [
  { symbol: "BTCUSDT", buy: 0, sell: 0, decimal: 0, status: "up" },
  { symbol: "SOLUSDT", buy: 0, sell: 0, decimal: 0, status: "up" },
  { symbol: "ETHUSDT", buy: 0, sell: 0, decimal: 0, status: "up" },
];

export const OpenTrades: OpenTradesTypes[] = [];

