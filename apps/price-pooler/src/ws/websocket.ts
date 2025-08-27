import { WebSocket } from "ws"
import { redis } from "../redis/redis";

const URL = 'wss://stream.binance.com:9443/stream?streams=' +
  [
    'btcusdt@aggTrade',
    'ethusdt@aggTrade',
    'bnbusdt@aggTrade',
    'xrpusdt@aggTrade',
    'adausdt@aggTrade',
  ].join('/');

export default class WebSocketInstance{
  private ws: WebSocket | null = null
  
  constructor(){
    this.web_socket_initialise();
  }

  private async web_socket_initialise(){
    this.ws = new WebSocket(URL);

    this.ws.onopen = () => {
      console.log('connected to binance web socket server');
    }

    this.ws.onmessage = async (event) => {
      const data = JSON.parse(event.data.toString());
      console.log(data)
      await redis.rPush("binance:trades", JSON.stringify(data))
      await redis.publish("ws:events:trade", JSON.stringify(data))
    }
  }
}