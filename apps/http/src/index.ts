import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const VIEW_MAP: Record<string, string> = {
  "1 minute": "trade_1m_cagg",
  "5 minutes": "trade_5m_cagg",
  "15 minutes": "trade_15m_cagg",
  "1 hour": "trade_60m_cagg",
  "24 hours": "trade_24h_cagg",
};

app.get('/candles', (req: Request, res: Response) => {
  try{
    
  }
  catch(error){

  }
})

app.listen(8001, () => {
  console.log("server is running on part 8001")
})