import { Router } from 'express'
import { googleAuth, googleAuthRdr } from './../../middleware/auth/googleOAuth2'
import { create, index, show, update, remove, logout, login, logoutAll, addFavorite, getFavorite,updateAdmin, getId } from './controller'
import auth from "../../middleware/auth/auth";
import checkAdmin from "../../middleware/auth/checkAdmin";
import isAdmin from "../../middleware/auth/isAdmin";
const router = new Router()

router.get('/', auth, isAdmin, index)
router.get('/:id', auth, isAdmin, show)
router.put('/update', auth, update)
router.delete('/delete', auth, isAdmin, remove)
router.post('/get_id', auth, isAdmin, getId)
router.post('/login', login)
router.post('/logout', auth, logout)
router.post('/logoutAll', auth, logoutAll)

// Google Auth
router.get("/login/google", googleAuth())
router.get("/login/google/redirect", googleAuthRdr(), (req, res) => {
    res.send(req.user);
})

router.post('/addUpdateFavorite', auth, addFavorite)
router.put('/updateAdmin/:id', auth, isAdmin, updateAdmin)
// hợp 2 api lại vừa user vừa admin
router.post("/create", checkAdmin, create);
// ko cần token của user
router.post("/create/notToken", create);
//  cần token của admin
router.post("/create/token", auth, isAdmin, create);

export default router;
