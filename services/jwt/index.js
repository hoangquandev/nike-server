import jwt from 'jsonwebtoken'
import Promise from 'bluebird' // lib that make a callback() to a promise()

const jwtPrivateKey = 'privatekey' // should be added to Env file, only server knows it

// convert callback() to promise()
// jwt.sign is a callback()
const jwtSign = Promise.promisify(jwt.sign)
const jwtVerify = Promise.promisify(jwt.verify)

// create token and send it to client when login success
// userid (payload data)
// options is encrypted type
// method = jwtSign (ES6) cách thức sign
// nếu không truyền kiểu khác thì default value = jwtSign 
export const sign = (id, options, method = jwtSign) => {
    method({id}, jwtPrivateKey, options)
}

// check the token just created TRUE or FALSE
export const verify = (token) => jwtVerify(token, jwtPrivateKey)