import { Router } from 'express'
import { password } from '../../services/passport';
import { sign } from './../../services/jwt'

const router = new Router()

router.post('/login', password(), (req, res, next) => {
    const user = req.user
    sign(user.id).then(token => {
        res.status(200).json(token)
    }).catch(err => {
        res.status(401).json(err)
    })
})

// Google Auth
// router.get("/google", passport.authenticate("google", {
//     scope: ["profile", "email"]
// }))

// router.get("/google/redirect", passport.authenticate('google'), (req, res) => {
//     res.send(req.user);
//     res.send("you reached the redirect URI");
// });

// login
// router.post("/user/login", async (req, res) => {
//     try {
//         const { email, password } = req.body
//         const user = await User.findByCredentials(email, password)
//         const token = await user.generateAuthToken();
//         res.send({ user, token }).status(200)
//     } catch (error) {
//         res.status(400).send(error)
//         console.log(error);
//     }
// })


// logout
// router.post("/logout", async (req, res) => {
//     console.log(req.user);
//     try {
//         req.user.tokens = req.user.tokens.filter((token) => {
//             return token.token != req.token
//         })
//         await req.user.save()
//         res.send().status(200)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

// // logout all
// router.post('/logoutall', async (req, res) => {
//     // Log user out of all devices
//     try {
//         req.user.tokens.splice(0, req.user.tokens.length)
//         await req.user.save()
//         res.send().status(200)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

export default router