function verifyToken(req, res, next){
    let token = req.headers['x-access-token']
    //console.log(token)
    if(!token){
        return res.status(401).send({auth: false, message: 'No token provided'})
    }else{
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if(err){
                return res.status(500).send({auth: false, message: `Failed to authenticate the token provided! ${err}`})
            }else{
               const user = await User.findOne({email: decoded.email})
               if(!user){
                   console.log({auth: false, message: 'No user found'})
                   return res.status(404).send({auth: false, message: 'No user found'})
               }else{
                   console.log("Token validated!", token)
                   console.log({auth: true, message: 'User found!', id: user._id, user: user.nickname})
                   return res.status(200).send({auth: true, message: 'Token validated and user found!', id: user._id, user: user.nickname})
               }
            }
        })
    }
}