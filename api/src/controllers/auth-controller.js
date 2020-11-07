const Auth = require('../models/Auth')
const jwt = require('jsonwebtoken')

// Special hash to signup new users 
// 06d80eb0c50b49a509b49f2424e8c805 = dog

JWT_SECRET = "supersecretsecret"

async function signup(req, res){
    console.log('Body of the signup request:')
    console.log(req.body)
    const { username, pin, hash } = req.body
    if(hash == "06d80eb0c50b49a509b49f2424e8c805"){
        const authUser = Auth.findOne({username: username})
        const authPin = Auth.findOne({pin: pin})
        if(authUser || authPin){
            console.log({msg: "Username or pin already in use"})
            return res.status(403).send({msg: 'Username or pin already in use'})
        }else{
            const newAuth = new Auth({username, pin})
            await newAuth.save()
            console.log({msg: `The user ${newAuth.username} has been created`})
            return res.status(201).send({msg: {msg: `The user ${newAuth.username} has been created`}})
        }
    }else{
        return res.status(400).send({msg: "Unauthorized"})
    }
}

async function signin(req, res){
    console.log('Body of the login request:')
    console.log(req.body)
    let authPin = req.body.pin
    let auth = Auth.findOne({pin: authPin})
    if(auth){
            let token = jwt.sign({pin: authPin}, JWT_SECRET, {expiresIn: 864000})
            console.log({auth: true, message: 'Pin authenticated', authToken: token})
            return res.status(200).send({auth: true, message: 'Pin authenticated', authToken: token})
        }else{
            console.log({auth: false, message: 'Incorrect pin!'})
            return res.status(401).send({auth: false, message: 'Incorrect pin!'})
    }
}

async function newPin(req, res){
    if(verifyToken){
        console.log("Body of the change pin request")
        console.log(req.body)
        const { oldPin, newPin } = req.body
        const query = {pin: oldPin}
        auth = Auth.findOne(query)
        if(auth){
            Auth.findByIdAndUpdate(query, {pin: newPin})
            return res.status(200).send({msg: "The pin has been changed"})
        }else{
            return res.status(400).send({msg: "The user corresponding to the pin doesn't exist"})
        }
    }else{
        return res.status(401).send({msg: "Unauthorized. You must login to logoff"})
    }
}

function logout(req, res){
    if(verifyToken){
        return res.status(200).send({msg: "Successful logoff"})
    }else{
        return res.status(401).send({msg: "Unauthorized. You must login to logoff"})
    }
}   

function verifyToken(){
    let token = req.headers['x-access-token']
    //console.log(token)
    if(!token){
        res.status(401).send({auth: false, message: 'No token provided'})
    }else{
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if(err){
                return false
            }else{
                console.log({auth: true, message: "Token validated!"})
                return true
            }
        })
    }
}

module.exports = {
    signin,
    signup,
    newPin,
    logout
}