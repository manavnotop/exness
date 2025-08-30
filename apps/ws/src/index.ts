import { createClient } from "redis";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuid } from 'uuid';

const wss = new WebSocketServer({ port: 8080 })
const sockets = new Map<string, WebSocket>()

const subscriber = createClient({ url: "redis://localhost:6379" })
subscriber.connect();

subscriber.subscribe("ws:events:trade", (message) =>{
  try{
    const parsed_message = JSON.parse(message);
    
    // Format the message for the frontend
    const formattedMessage = {
      type: 'trade',
      data: parsed_message,
      timestamp: Date.now()
    };
    
    
    sockets.forEach((socket) => {
      if(socket.readyState === socket.OPEN){
        socket.send(JSON.stringify(formattedMessage));
      }
    })
  }
  catch(error){
    console.error('Failed to send message', error);
  }
})

wss.on('connection', (ws) => {
  const id = uuid();
  sockets.set(id, ws);
  
  console.log(`Client connected: ${id}`);

  ws.on('close', () => {
    sockets.delete(id);
    console.log(`Client disconnected: ${id}`);
  })
  
  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${id}:`, error);
    sockets.delete(id);
  })
})

console.log('WebSocket server started on port 8080');