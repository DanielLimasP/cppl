const Info = require('../models/Info')
const Auth = require('../models/Auth')
const jwt = require('jsonwebtoken')
const vt = require('../middleware/verify-token')

// Given that we will add info using third party python app
// instead via the frontend, We cannot rely on having a jwt 
// being sent to the server, hence why we use our ultra secret 
// hash 06d80eb0c50b49a509b49f2424e8c805

async function addInfo(req, res){
    console.log("Body of the addInfo request")
    console.log(req.body)
    let { 
        peopleEntering,
        storePin,
        hash
    } = req.body

    let store = await Auth.findOne({pin: storePin})
    const timestamp = Date.now()
    
    if(hash == "06d80eb0c50b49a509b49f2424e8c805" && store){
        const oldPeopleInside = store.peopleInside
        let peopleInside = oldPeopleInside + peopleEntering
        const query = {pin: storePin}

        await Auth.findOneAndUpdate(query, {peopleInside, timestamp})
        const newInfo = new Info({peopleEntering, peopleInside, storePin, timestamp})
        await newInfo.save()
        return res.status(201).send({msg: "Info added", info: newInfo})
    }else{
        return res.status(403).send({msg: "Unauthorized"})
    }
}

async function getInfo(req, res){
    console.log("Query params of the getInfo request")
    console.log(req.query)
    let { pin, hash } = req.query
    let store = await Auth.findOne({pin})
    
    if(hash == "06d80eb0c50b49a509b49f2424e8c805" && store){
        const storeInfo = await Info.find({storePin: pin}).sort('timestamp')
        console.log({msg: "Info", info: storeInfo})
        return res.status(200).send({msg: "Info", info: storeInfo})
    }else{
        return res.status(403).send({msg: "Unauthorized"})
    }
}

module.exports = {
    addInfo,
    getInfo
}