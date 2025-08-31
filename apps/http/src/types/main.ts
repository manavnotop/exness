export interface AssetData {
    symbol: string 
    buy: number
    sell: number 
    decimal : number
    status: "up" | "down"
}


export interface IncomingAssetData {
    timestamp: string,
    asset: string,
    price: number,
    buy: number,
    sell: number,
    decimal: number
}

export interface OpenTradesTypes {
    orderId: number 
    volume: number 
    margin: number
    openPrice: number
    asset: string
    type: 'Buy' | 'Sell'
    stopLoss: number | null
    takeProfit: number | null
}

export interface OpenTradeRequest {
    type: 'Buy' | 'Sell'
    volume: number
    asset: string
    leverage?: number
    stopLoss?: number
    takeProfit?: number
}

export interface CloseTradeRequest {
    orderId: number
}
