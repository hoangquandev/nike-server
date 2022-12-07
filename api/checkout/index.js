import { Router } from 'express'
import { paypalMethod, processing, success, failed } from './controller'

const router = new Router()

router.get('/paypal', paypalMethod)
router.get('/processing', processing)
router.get('/success', success)
router.get('/failed', failed)

export default router