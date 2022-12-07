import { Router } from 'express'
import { create, index, show, update, remove, categories, genders } from './controller'
import auth from "../../middleware/auth/auth";
import isAdmin from "../../middleware/auth/isAdmin"
const router = new Router()

router.get('/', index)
router.get('/categories', categories)
router.get('/genders', genders)
router.get('/:id', show)
router.post('/create', auth,isAdmin,create)
router.put('/update', auth,isAdmin,update)
router.delete('/delete', auth,isAdmin,remove)

export default router