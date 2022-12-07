import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import cors from 'cors'
import swaggerUI from "swagger-ui-express"
import swaggerDocument from "../../swagger/swagger.json";
import passport from 'passport'
import cookieSession from 'cookie-session'

export default (apiRootURL, router) => {
    const app = new express()

    app.use(cors())
    app.use(compression())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
    app.use(cookieSession({
        // milliseconds of a day
        maxAge: 24 * 60 * 60 * 1000,
        keys: [process.env.COOKIE_KEY]
    }))
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(apiRootURL, router)

    // app.get('/* ', (req, res) => {
    //     res.send('Hello World!')
    // })
    return app
}