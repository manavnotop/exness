import { WebSocket } from "ws"
import { redis } from "../redis/redis";

export default class WebSocketInstance{
  private ws: WebSocket | null = null
  
  constructor(){
    this.web_socket_initialise();
  }

  private async web_socket_initialise(){
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    this.ws.onopen = () => {
      console.log('connected to binance web socket server');
    }

    this.ws.onmessage = async (event) => {
      //const data = JSON.parse(JSON.stringify(event.data))
      console.log('reached websocket')
      const data = JSON.parse(event.data.toString());
      console.log(data)
      await redis.rPush("binance:trades", JSON.stringify(data))
    }
  }
}