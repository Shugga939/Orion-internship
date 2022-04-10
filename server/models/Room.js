import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Room = new Schema({
  name: {type: String, required: true},
  image: {type: String},
  messages : [{type: Object, ref: 'Message', required: true}],
})

export default mongoose.model('Room', Room)