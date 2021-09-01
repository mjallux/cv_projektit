import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// env variables & mongoose conn
import './init.js'

async function expressAuth(req, res, next) {
    if(await authenticated(req.body.token)) {
        return next()
    }
    let error = new Error("Unauthorized")
    error.name = "Authorization"
    return next(error)
}

function authenticate(user, password, minutes) {
    return new Promise(async (resolve, reject) => {
        let result = await bcrypt.compare(password, user.password)
        if(result) {
            resolve(generateToken(user, minutes))
        } 

        reject("hash comparison failed")
    })
}

function generateToken(user, minutes) {
    return jwt.sign(
        { name: user.username,
         admin: user.admin },
        process.env.JWT_TOKEN_SECRET,
        { expiresIn: minutes })
}

function decodeToken(token) {
    if(token) {
        return jwt.decode(token, process.env.JWT_TOKEN_SECRET)
    }
    return false
}

function authenticated(token) {
    const decoded = decodeToken(token)
    return decoded.admin
}

module.exports = {
    authenticate, expressAuth
}