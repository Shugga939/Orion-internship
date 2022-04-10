import Room from '../models/Room.js'
import User from '../models/User.js'
import userStore from '../store/userStore.js'
import path from 'path'
import {v4} from 'uuid'
import {fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// helpers
async function getAllowedRoomsWithLastMessages() { 
  let allowedRooms = userStore.getAllowedRooms()
  let roomsWithLastMessages = []
    
  await Promise.all (allowedRooms.map(async(roomId)=> {
    const room = await Room.findById({_id: roomId})
    if (room?.messages) {
      roomsWithLastMessages.push({id: roomId, name: room.name, image: room.image, lastMessage : room.messages[0]})
    }
  }))
    
  return roomsWithLastMessages
}

class chatController {

  // return Unreading Messages
  async getMessages (req, res) { 
    let {id} = req.params
    let roomId = req.headers.roomid
    if (id == 'getUsers') return
    if (id == 'getCount' && id !=undefined) {
      const lastReadingMessages = await User.findOne({_id: userStore.getId()}, 'lastReadMessage')
      const timeOfLastReadMessage =  lastReadingMessages.lastReadMessage[roomId]
      const countUnreadingMessages = await Room.findOne( {_id: roomId}, 'messages').then(
        function (res) {
          let count = 0;
          for (let index = 0; index < res.messages.length; index++) {
            if (res.messages[index].time > timeOfLastReadMessage) {
              count++
            } else {
              break
            }
          }
          return count
        }
      ).catch(err=>console.log(err))
      
      return res.json({countUnreadingMessages})

    } else if (id !=undefined && id !== 'main') {
      const room = await Room.findById({_id: id})
      return res.json(room.messages)
    }      
  }
  
  // search all users in room
  async getUsers (req, res) {
    let {id} = req.params
    const users = await User.find({allowRooms: id}, '_id avatar username')
    return res.json(users)
  }


  
// return allowed Rooms With Last Messages for roomList
  async getRooms (req, res) {    
    if (req.headers.lastmessages) {
    let rooms = await getAllowedRoomsWithLastMessages()
    return res.json(rooms)

    } else {
      const allRooms = await Room.find()
      return res.json(allRooms)
    }
  }

  // create new room
  async createRoom (req, res) {
    let room = req.body
    let imageName

    if (req.files) {
      const {image} = req.files
      imageName = v4() + ".jpg"
      image.mv(path.resolve(__dirname, '..', 'static', imageName))
    } else {
      imageName = 'defaultAvatar_group.jpg'
    }
    const newRoom = new Room({name :room.name, image:imageName, messages: []})
    await newRoom.save()
    
    const welcomeMessage = {
      username : '',
      message: 'Сhat created',
      time: Date.now(),
      event: 'notice',
      roomId: newRoom._id.toString()
    }
     await Room.updateOne({_id:newRoom._id}, {$push: {messages: welcomeMessage} }) // push welcome message  // todo event 'notice'
     await User.updateOne({_id:userStore.getId()}, {$push: {allowRooms: newRoom._id} }) //add room to allowed rooms at user
     
     const allowedRooms = userStore.getAllowedRooms()
     allowedRooms.push(newRoom._id.toString())
     userStore.setAllowedRooms(allowedRooms)  // save allowedRooms in store
     
     let rooms = await getAllowedRoomsWithLastMessages()
    return res.json(rooms)
  }

  async changeRoom (req, res) {
    const {name} = req.body
    let roomId = req.headers.roomid
    if (req.files) {
      const {avatar} = req.files
      let fileName = v4() + ".jpg"
      console.log(roomId)
      avatar.mv(path.resolve(__dirname, '..', 'static', fileName));
      await Room.updateOne({_id: roomId}, { $set: {image :fileName}})
    }
    if (name) await Room.updateOne({_id: roomId}, { $set: {name : name}})
    return res.json({'message':'success'})
  }
  
}

export default new chatController()