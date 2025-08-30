import { createClient, RedisClientType } from 'redis';
import { prismaClient } from "@repo/db/client";

const redis: RedisClientType = createClient();

redis.on('error', err => console.log('Redis Client Error', err));

let isConnected = false;

async function connectRedis() {
  if (!isConnected) {
    await redis.connect();
    isConnected = true;
    console.log("✅ Redis connected in batch-uploader");
  }
}

async function startBatchProcess(){
  const BATCH_SIZE = 500
  const FLUSH_INTERVAL = 500000

  let batch: any[] = []
  let lastFlushDate = Date.now();

  async function flushBatch(){
    if(batch.length === 0) return;

    try{
      await prismaClient.trade.createMany({
        data: batch.map(trade => ({
          symbol: trade.data.s,
          price: trade.data.p,
          quantity: trade.data.q,
          trade_time: new Date(Number(trade.data.T)),
        })),
      })
      console.log(`Inserted batch of ${BATCH_SIZE} length`);

      batch = [];
      lastFlushDate = Date.now();
    }
    catch(error){
      console.error("Failed to insert in DB", error);
      throw error;
    }
  }

  while(true){
    try{
      const item = await redis.lPop("binance:trades");

      if(item){
        const data = JSON.parse(item);
        batch.push(data);
      }

      if(batch.length >= BATCH_SIZE){
        await flushBatch();
      }

      if(Date.now() - lastFlushDate > FLUSH_INTERVAL && batch.length > 0){
        await flushBatch();
      }
    }
    catch(error){
      console.log("error occured while poping data from the queue")
    }
  }
}

async function main(){
  await connectRedis();
  await startBatchProcess();
}

main();