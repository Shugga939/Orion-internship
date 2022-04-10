import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Message = new Schema({
  userId: {type: String, unique: false, required: true},
  username: {type: String, required: true},
  message: {type: String, required: true},
  time : {type: Number, required: true},
  event: {type: String, required: true},
  roomId: {type: String, required: true},
})

export default mongoose.model('Message', Message)