import {Router} from 'express'
import chatRouter from './chatRouter.js'
import userRouter from './userRouter.js'

const router = new Router()

router.use('/user', userRouter)
router.use('/chat', chatRouter)

export default router
