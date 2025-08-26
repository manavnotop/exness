import { WebSocket } from "ws"

export default class WebSocketInstance{
  private ws: WebSocket | null = null
  
  constructor(){
    this.web_socket_initialise();
  }

  private web_socket_initialise(){
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

    this.ws.onopen = () => {
      console.log('connected to binance web socket server');
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(JSON.stringify(event.data))
      console.log(data)
    }
  }
}