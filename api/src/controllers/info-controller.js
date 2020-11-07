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
        peopleInside,
        store,
        hash
    } = req.body

    let validStore = await Auth.findOne({storeName: store})
    const timestamp = Date.now()
    console.log(validStore)
    if(hash == "06d80eb0c50b49a509b49f2424e8c805" && validStore){
         const newInfo = new Info({peopleEntering, peopleInside, store, timestamp})
         await newInfo.save()
         return res.status(201).send({msg: "Info added", info: newInfo})
    }else{
        return res.status(403).send({msg: "Unauthorized"})
    }
}

module.exports = {
    addInfo
}