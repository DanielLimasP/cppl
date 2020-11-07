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

module.exports = verifyToken