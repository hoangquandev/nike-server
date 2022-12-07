import path from 'path'
import merge from 'lodash/merge'

const requireProcessEnv = name => {
    if (!process.env[name]) {
        throw new Error(`You must set the ${name} environment variable`)
    }
    return process.env[name]
}

// load 2 files env & env.default
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv-safe')
    dotenv.config({
        path: path.join(__dirname, './.env'),
        sample: path.join(__dirname, './.env')
    })
}

// config the app for dev, production env
const config = {
    all: {
        env: process.env.NODE_ENV || 'development',
        root: path.join(__dirname, '..'),
        port: process.env.PORT || 3000,
        ip: process.env.IP || '0.0.0.0',
        apiRoot: process.env.API_ROOT || '',
    },
    test: {
        // for tester
    },
    development: {
        // for development enviroment
        // mysql: {
        //     host: 'remotemysql.com',
        //     database: 'JlLB9c2RpR',
        //     username: 'JlLB9c2RpR',
        //     password: 'ufK4Q700O6',
        // }
    },
    production: {
        ip: process.env.IP || undefined,
        port: process.env.PORT || 8080,
        // mysql: {
        //     host: process.env.HOST || 'localhost',
        //     database: process.env.DATABASE || 'demo-db',
        //     username: process.env.DBUSERNAME || 'root',
        //     password: process.env.DBPASSWORD || '',
        // }
    }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports