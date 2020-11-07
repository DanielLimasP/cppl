const Auth = require('../models/Auth')
const jwt = require('jsonwebtoken')

async function signup(req, res){
    console.log('Body of the signup request:')
    console.log(req.body)
    const { username, pin } = req.body
    const auth = Auth.findOne({username: username})
    if(auth){
        console.log({msg: "That username already exists!"})
        return res.status(401).send({msg: 'Username already exists!'})
    }else{
        const newAuth = new Auth({username, pin})
        await newAuth.save()
        console.log({msg: `The user ${newAuth.username} has been created`})
        return res.status(200).send({msg: {msg: `The user ${newAuth.username} has been created`}})
    }
}

async function signin(req, res){
    console.log('Body of the login request:')
    console.log(req.body)

}

async function newPin(req, res){

}

function logout(req, res){

}

function verifyToken(){
    let token = req.headers['x-access-token']
    //console.log(token)
    if(!token){
        res.status(401).send({auth: false, message: 'No token provided'})
    }else{
        jwt.verify(token, "supersecretsecret", async (err, decoded) => {
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