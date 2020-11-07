const Auth = require('../models/Auth')
const jwt = require('jsonwebtoken')

// Special hash to signup new stores 
// 06d80eb0c50b49a509b49f2424e8c805 = dog

JWT_SECRET = "supersecretsecret"

async function signup(req, res){
    console.log('Body of the signup request:')
    console.log(req.body) 
    const { storeName, pin, storeCapacity, hash } = req.body
    const authPin = await Auth.findOne({pin})
    const authName = await Auth.findOne({storeName})
    if(hash == "06d80eb0c50b49a509b49f2424e8c805"){
        if(authPin || authName){
            console.log(authPin)
            console.log({msg: "Name or pin already in use"})
            return res.status(403).send({msg: 'Name or pin already in use'})
        }else{
            const newAuth = new Auth({storeName, pin, storeCapacity})
            await newAuth.save()
            console.log({msg: `The store ${newAuth.storeName} has been created`})
            return res.status(201).send({msg: `The store ${newAuth.storeName} has been created`})
        }
    }else{
        return res.status(400).send({msg: "Unauthorized"})
    }
}

async function signin(req, res){
    console.log('Body of the login request:')
    console.log(req.body)
    let pin = req.body.pin
    let auth = await Auth.findOne({pin: pin})
    if(auth){
        console.log(auth)  
        let token = jwt.sign({pin}, JWT_SECRET, {expiresIn: 864000})
        console.log({auth: true, message: 'Pin authenticated', authToken: token})
        return res.status(200).send({auth: true, message: 'Pin authenticated', authToken: token})
    }else{
        console.log({auth: false, message: 'Incorrect pin!'})
        return res.status(401).send({auth: false, message: 'Incorrect pin!'})
    }
}

async function newPin(req, res){
    let token = req.headers['x-access-token']
    let valid = await verifyToken(token)
    console.log(valid)
    if(valid){
        console.log("Body of the change pin request")
        console.log(req.body)
        const { pin, newPin } = req.body
        const query = {pin: pin}
        auth = await Auth.findOne(query)
        if(auth){
            await Auth.findOneAndUpdate(query, {pin: newPin})
            return res.status(200).send({msg: "The pin has been changed"})
        }else{
            return res.status(400).send({msg: "The store corresponding to the pin doesn't exist"})
        }
    }else{
        return res.status(401).send({msg: "Unauthorized"})
    }
}

// Logout only works on the side of the client
function logout(req, res){
    if(verifyToken){
        return res.status(200).send({msg: "Successful logoff", token: "", auth: false})
    }else{
        return res.status(401).send({msg: "Unauthorized. You must login to logoff"})
    }
}   

async function verifyToken(token){
    //console.log(token)
    if(!token){
        console.log({auth: false, message: 'No token provided'})
        return false;
    }else{
        let valid = await jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if(err){
                console.log({auth: false, message: 'Error validating token'})
                return false; 
            }else{
                console.log({auth: true, message: "Token validated!"})
                return true;
            }
        }).then(validated => {
            return validated
        })
        return valid
    }
}

module.exports = {
    signin,
    signup,
    newPin,
    logout
}