import { createClient } from "redis";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuid } from 'uuid';

const wss = new WebSocketServer({ port: 8080 })
const sockets = new Map<string, WebSocket>()

const subscriber = createClient({ url: "redis://localhost:6379" })
subscriber.connect();

subscriber.subscribe("ws:events:trade", (message) =>{
  console.log("message came");
  try{
    const parsed_message = JSON.parse(message);
    sockets.forEach((socket) => {
      if(socket.readyState === socket.OPEN){
        console.log('sending to socket');
        socket.send(JSON.stringify(parsed_message));
      }
    })
  }
  catch(error){
    console.error('Failed to send messaged', error);
  }
})

wss.on('connection', (ws) => {
  const id = uuid();
  sockets.set(id, ws);

  ws.on('close', () => {
    sockets.delete(id);
  })
})
