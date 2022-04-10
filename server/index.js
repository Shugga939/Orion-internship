import WebSocketServer from 'ws';
import express from "express";
import {createServer} from 'http'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import mongoose from 'mongoose';
import router from './routes/main.js'
import errorHandler  from './middleware/errorHandlingMiddleware.js';
import authMiddleware from './middleware/AuthMiddleware.js'
import userStore from './store/userStore.js';
import Room from './models/Room.js'
import Message from './models/Message.js'
import path from 'path'
import {fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app)
server.listen(process.env.PORT, ()=>console.log('start'))

try {   //todo start func
  await mongoose.connect('mongodb+srv://Shugga939:Iamtracer123@cluster0.0uyxt.mongodb.net/Realtime_chat?retryWrites=true&w=majority')
} catch (e) {
  console.log(e)
}


app.use(cors({
  origin : 'http://localhost:3000',
  credentials : true
}))
app.use(express.json())
app.use(fileUpload())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(cookieParser())
app.use('/',router)

// app.use(authMiddleware)
app.use(errorHandler)  //error middleware

const wss = new WebSocketServer.Server({
  server
})


wss.on('connection', function connection(ws, req) {
  

  // ws.on('close', function () {
  //   wss.clients.forEach(client => {
  //     client.send(JSON.stringify({event:'offline', payload:'username'}))
  //   })
  // })

  ws.on('message', function (message) {
    message = JSON.parse(message);
    (async function () {
      const newMessage =  new Message ({...message})
      await newMessage.save()
      await Room.updateOne({_id:newMessage.roomId}, {$push: {messages: {$each: [newMessage], $position: 0 } } })

    switch (message.event) {
      case 'message':
        broadcastMessage(message)
        break;
      case 'connection':
        broadcastMessage(message)
        break;
    }})();
  })
})


function broadcastMessage(message) {
  wss.clients.forEach(client => {
    if (userStore.getAllowedRooms().includes(message.roomId)) {
      client.send(JSON.stringify(message))
    }
  })
}

