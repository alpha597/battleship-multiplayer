const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT ||3000;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
//set static folder
app.use(express.static(path.join(__dirname,"public")));
//start server
server.listen(PORT ,() =>{
   console.log( `Server is running on ${PORT}`)
})
const connections =[null,null]
io.on('connection',(socket)=> {
   console.log('New websocket Connection')
   let playerIndex = -1;
   for(i in connections){
    if(connections[i] == null){
        playerIndex=i;
        break;
    }
   }
  
   socket.emit('player-number',playerIndex)
   console.log(`Player ${playerIndex} has connected`)
   if(playerIndex== -1){
    return
   }
   connections[playerIndex] = false;
   socket.broadcast.emit('player-connection',playerIndex)
   // handle disconnect
   socket.on('disconnect',() =>{
    console.log(`Player ${playerIndex} disconnected`)
    connections[playerIndex] = null;
    socket.broadcast.emit('player-cconnection',playerIndex)
   })
   socket.on('player-ready',() =>{
      socket.broadcast.emit('enemy ready',playerIndex)
      connetions[playerIndex] = true;
   })
   socket.on('check-players',() =>{
      const players =[]
      for(const i in connections){
         connections[i] === null ? players.push({connected : false,ready : false}):
         players.push({connected: true,ready : connections[i]})
      }
      socket.emit('check-players',players)
   })
   //On fires recieved
   socket.on('fire',id =>{
      console.log(`Shot fired from ${playerIndex} `,id)
      socket.broadcast.emit('fire',id)

   })
   socket.on('fire-reply', square =>{
      console.log(fire)
      socket.broadcast.emit('fire-reply',square)
   })
   setTimeout(() =>{
    connetions[playerIndex]=null;
    socket.emit('timeout')
    socket.disconnect()
   },600000)// 10 minutes per player
})
