import {Router} from 'express'
import chatController from './../controlers/chatController.js'
const chatRouter = new Router()

chatRouter.get('/',chatController.getRooms)
chatRouter.get('/:id',chatController.getMessages)
chatRouter.post('/rooms',chatController.createRoom)
chatRouter.put('/rooms',chatController.changeRoom)
chatRouter.get('/:id/getUsers',chatController.getUsers)


export default chatRouter