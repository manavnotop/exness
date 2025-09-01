import express, { Router, Request, Response } from 'express'
import { Assets, OpenTrades } from '../const'
import { OpenTradeRequest, CloseTradeRequest } from '../types/main'

export const tradesRouter: Router = express.Router()

// Mock global account for testing (in-memory)
const mockAccount = {
  balance: { USD: 10000 }, // Starting balance
  usedMargin: 0,
}

let openTradeId = 0

// All closed orders (placeholder)
tradesRouter.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'closed orders',
    note: 'This is a mock endpoint for future closed orders.',
  })
})

// Get current open orders
tradesRouter.get('/get-orders', (req: Request, res: Response) => {
  if (OpenTrades.length > 0) {
    const activeTrades = OpenTrades.map((trade) => {
      const assetData = Assets.find((a) => a.symbol === trade.asset)
      if (!assetData) return null

      // PnL calculation using big integers
      const currentPnl = trade.type === 'Buy'
        ? (assetData.sell - trade.openPrice) * trade.volume
        : (trade.openPrice - assetData.buy) * trade.volume

      return {
        orderId: trade.orderId,
        asset: trade.asset,
        type: trade.type,
        volume: trade.volume,
        open_price: trade.openPrice / Math.pow(10, assetData.decimal),
        current_price:
          trade.type === 'Buy'
            ? assetData.sell / Math.pow(10, assetData.decimal)
            : assetData.buy / Math.pow(10, assetData.decimal),
        pnl: currentPnl / Math.pow(10, assetData.decimal),
        stopLoss: trade.stopLoss,
        takeProfit: trade.takeProfit,
        margin: trade.margin,
      }
    }).filter(Boolean)

    return res.json(activeTrades)
  }

  return res.json([])
})

// Open a new trade
tradesRouter.post('/open', (req: Request<{}, {}, OpenTradeRequest>, res: Response) => {
  console.log('POST: /api/open')

  const { type, volume, asset, leverage = 1, stopLoss, takeProfit } = req.body

  const currentAsset = Assets.find((a) => a.symbol === asset)
  if (!currentAsset) {
    return res.status(400).json({ error: 'Invalid asset' })
  }

  const currentBuy = currentAsset.buy / Math.pow(10, currentAsset.decimal)
  const currentSell = currentAsset.sell / Math.pow(10, currentAsset.decimal)

  const positionValue = volume * (type === 'Buy' ? currentBuy : currentSell)
  const margin = positionValue / leverage

  if (mockAccount.balance.USD - mockAccount.usedMargin < margin) {
    return res.json({
      message: 'insufficient balance',
    })
  }

  // Update used margin
  mockAccount.usedMargin += margin

  // Store prices as big integers (for precision)
  const openPrice = type === 'Buy' ? currentAsset.buy : currentAsset.sell

  openTradeId++

  OpenTrades.push({
    orderId: openTradeId,
    volume,
    margin,
    openPrice,
    asset,
    type,
    takeProfit: takeProfit ?? null,
    stopLoss: stopLoss ?? null,
  })

  const currentPrice = type === 'Buy' ? currentAsset.sell : currentAsset.buy

  return res.json({
    orderId: openTradeId,
    balance: mockAccount.balance.USD,
    open_price: openPrice / Math.pow(10, currentAsset.decimal),
    current_price: currentPrice / Math.pow(10, currentAsset.decimal),
    margin,
    leverage,
    type,
    status: 'opened',
  })
})

// Close an open trade
tradesRouter.post('/close', (req: Request<{}, {}, CloseTradeRequest>, res: Response) => {
  console.log('POST: /api/close')

  const { orderId } = req.body

  const index = OpenTrades.findIndex((t) => t.orderId === orderId)
  if (index === -1) {
    return res.json({
      status: 'failed',
      message: 'Trade not found',
    })
  }

  const trade = OpenTrades[index]
  if (!trade) {
    return res.json({
      status: 'failed',
      message: 'Trade not found',
    })
  }

  const assetData = Assets.find((a) => a.symbol === trade.asset)
  if (!assetData) {
    return res.json({
      status: 'failed',
      message: 'Asset not found',
    })
  }

  // PnL calculation using big integers
  const pnl =
    trade.type === 'Buy'
      ? (assetData.sell - trade.openPrice) * trade.volume
      : (trade.openPrice - assetData.buy) * trade.volume

  // Convert PnL to decimal and update balance
  const pnlInUsd = pnl / Math.pow(10, assetData.decimal)
  mockAccount.balance.USD += pnlInUsd
  mockAccount.usedMargin -= trade.margin

  // Remove the trade
  OpenTrades.splice(index, 1)

  return res.json({
    status: 'success',
    message: `Trade closed. PnL: ${pnlInUsd.toFixed(2)} USD`,
    balance: mockAccount.balance.USD,
    pnl: pnlInUsd,
  })
})