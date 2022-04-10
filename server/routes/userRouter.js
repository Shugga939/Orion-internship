import {Router} from 'express'
const userRouter = new Router()
import userController from './../controlers/userController.js'
import authMiddleware from './../middleware/AuthMiddleware.js'

userRouter.post('/login', userController.login)
userRouter.post('/chat', userController.logout)
userRouter.post('/registration', userController.registration)
userRouter.get('/auth', authMiddleware, userController.check)
userRouter.put('/change', userController.update)
userRouter.get('/invite/:id',authMiddleware, userController.joinRoom)


export default userRouter
