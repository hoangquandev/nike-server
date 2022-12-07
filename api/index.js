import { Router } from 'express'
import user from './user'
import auth from './../middleware/auth/auth'
import product from './product'
import cart from './cart'
import checkout from './checkout'

const router = new Router()

// use middleware below
router.use('/users', user)
router.use('/auth', auth)
router.use('/product', product)
router.use('/cart', cart)
router.use('/checkout', checkout)

export default router