import bcrypt from 'bcrypt'
import ApiError from './../error/ApiError.js'
import jwt from 'jsonwebtoken'
import User from './../models/User.js'
import Room from '../models/Room.js'
import userStore from '../store/userStore.js'
import path from 'path'
import {v4} from 'uuid'
import {fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateJwt = (id, name, email) => {
  return jwt.sign(
    {id, email, name}, 
    process.env.SECRET_KEY,
    {expiresIn: "24h"}
  )  
}

class userController {

  // update information (name, avatar) or last reading messages
  async update (req, res, next) {
    const changeableField =  req.headers.update
    
    if (changeableField) {
      switch (changeableField) {
        case 'information' : {
          const {name} = req.body
          if (req.files) {
            const {avatar} = req.files
            let fileName = v4() + ".jpg"
            avatar.mv(path.resolve(__dirname, '..', 'static', fileName))
            await User.updateOne({_id:userStore.getId()}, { $set: {avatar :fileName}})
          }
          if (name) await User.updateOne({_id:userStore.getId()}, { $set: {username : name}})
          break
        }
        case 'readMessage' : {
          const {roomId, time} = req.body
          const user = await User.findById({_id:userStore.getId()})
          let messagesObj = user.lastReadMessage
          if (typeof messagesObj != 'object') messagesObj ={}
          messagesObj[roomId] = time
          await User.updateOne({_id:userStore.getId()}, { $set: {lastReadMessage :messagesObj}})
          break
        }
        case 'leaveRoom' : {
          const {roomId} = req.body
          await User.updateOne({_id:userStore.getId()}, { $pull: {allowRooms : roomId}})
          console.log(userStore.getAllowedRooms())
          console.log(roomId)
          let updatedArray = userStore.getAllowedRooms().filter((el)=> el != roomId)
          userStore.setAllowedRooms(updatedArray)
          console.log(userStore.getAllowedRooms())
          break
        }
      }
      return res.json({'message':'success'})

    } else {
      return next(ApiError.badRequest({message: 'Invalid data'})) 
    }
  }

  async login (req, res, next) {
    const {email, password} = req.body
    if (!email || !password) {
      return next(ApiError.badRequest({message: 'Invalid data'})) 
    }

    try {
      const user = await User.findOne({email})
      if (!user) {
        return next(ApiError.notFound({message: 'Invalid data'})) 
      }
  
      let comparePassword = bcrypt.compareSync(password,user.password)
      if (!comparePassword) {
        return next(ApiError.notFound({message: 'Invalid data'}))
      }
      
      const token = generateJwt(user._id, user.username, user.email) 
      res.cookie('token',token, {
        maxAge: 8640 * 10000,
        path: '/',
        // domain: 'localhost:3000'
      })
      userStore.setId(user._id)
      userStore.setAllowedRooms(user.allowRooms)
      
      return res.json({token, lastReadMessage: user.lastReadMessage, avatar: user.avatar})
    } catch (e) {
      console.log(e)
      return next(ApiError.serviceUnavailable({message: 'Error'}))
    }
  }


  async registration (req, res, next) {
    const {email, name, password} = req.body

    if (!email || !password || !name) {
      return next(ApiError.badRequest({message: 'Invalid data'})) 
    }

    const condidate = await User.findOne({email})
    if (condidate) {
      return next(ApiError.badRequest({message: 'Email busy'}))
    } 

    const hashPassword = await bcrypt.hash(password,5)

    try{
      const user = new User({email, username: name, password:hashPassword, lastReadMessage:{}, allowRooms:[]})
      await user.save()
      const token = generateJwt(user._id, user.username, user.email) 
      res.cookie('token',token, {
        maxAge: 3600 * 24,
        path: '/',
        // domain: 'localhost:3000'
      })
      userStore.setId(user._id)
      userStore.setAllowedRooms(user.allowRooms)

      return res.json({token, lastReadMessage: user.lastReadMessage, avatar: user.avatar})
    } catch (e) {
      console.log(e)
      return next(ApiError.serviceUnavailable({message: 'Error'}))
    }
  }

   // check autorisation , if ok - return refreshed token
  async check (req, res, next) {
    try {
      let email = req.user.email
      const user = await User.findOne({email})
      userStore.setId(user._id)
      userStore.setAllowedRooms(user.allowRooms)
  
      const token = generateJwt(user._id, user.username, user.email) 
      res.cookie('token', token, {  
        maxAge: 3600 * 24,
        path: '/',
        // domain: 'localhost:3000'
      })
      
      return res.json({token, lastReadMessage: user.lastReadMessage, avatar: user.avatar})
    } catch (e) {
      return next(ApiError.serviceUnavailable({message: 'Error'}))
    }
  }


  async logout (req, res, next) {
    try {
      res.cookie('token', '', {
        maxAge: 0,
        path: '/',
        // domain: 'localhost:3000'
      })
      return res.json({message:'logout'})
    } catch (e) {
      return next(ApiError.serviceUnavailable({message: 'Error'}))
    }
  }

  async joinRoom (req, res, next) {
    const {id} = req.params
    try {
      const room = await Room.findById({_id: id})
      await User.updateOne({_id:userStore.getId()}, { $push: {allowRooms : id}})
      res.redirect('http://localhost:3000/');

    } catch (e) {
      res.redirect('http://localhost:3000/invalid');
    }
  }

}

export default new userController()