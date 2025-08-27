import { batchWorker } from "./queue/queue";
import { connectRedis } from "./redis/redis";
import WebSocketInstance from "./ws/websocket";

async function main() {
  await connectRedis();
  new WebSocketInstance();
}
main();