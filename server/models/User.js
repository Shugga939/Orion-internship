// const {Schema, model} = require('mongoose')
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
  email: {type: String, unique: true, required: true},
  username: {type: String, required: true},
  password: {type: String, required: true},
  avatar: {type: String},
  lastReadMessage: {type: Object, default: {}},
  allowRooms: [{type: String, required: true}],
  // private rooms
})

export default mongoose.model('User', User)