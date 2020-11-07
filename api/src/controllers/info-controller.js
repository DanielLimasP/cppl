const Info = require('../models/Info')
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

    if(hash == "06d80eb0c50b49a509b49f2424e8c805")){
        // Do something
    }

    return 
}