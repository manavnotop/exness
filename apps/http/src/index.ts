import express, { Request, Response } from 'express';
import cors from 'cors';
import { prismaClient } from '@repo/db/client'

const app = express();

app.use(express.json());
app.use(cors());

const VIEW_MAP: Record<string, string> = {
  "1-minute": "trade_1m_cagg",
  "5-minutes": "trade_5m_cagg",
  "15-minutes": "trade_15m_cagg",
  "1-hour": "trade_60m_cagg",
  "24-hours": "trade_24h_cagg",
};

app.get('/candles', async (req: Request, res: Response) => {
  try{
    const { symbol, interval, limit = 100 } = req.query;
    console.log(interval);
    if(!symbol || !interval){
      res.status(400).json({
        error: "symbol and interval are required",
      })
    }

    const viewName = VIEW_MAP[interval as string];
    if(!viewName){
      res.status(400).json({
        error: "interval required or requested interval not allowed"
      })
    }
    
    const candles = await prismaClient.$queryRawUnsafe(`
      SELECT 
        time, open, high, low, close, quantity_total, volume, 
        trade_count::text as trade_count
      FROM ${viewName}
      WHERE symbol = $1
      ORDER BY time DESC
      LIMIT $2
    `, symbol, Number(limit));
    
    console.log("candles are : ", candles);
    res.json({ symbol, interval, candles });
    return;
  }
  catch(err){
    console.error(err);
    res.status(500).json({
      error: "internal server error",
      err
    })
  }
})

app.listen(8001, () => {
  console.log("server is running on part 8001")
})