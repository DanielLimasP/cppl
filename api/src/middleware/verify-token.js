const jwt = require('jsonwebtoken')

function verifyToken(req, res, next){
    let token = req.headers['x-access-token']
    const JWT_SECRET = 'ultrasecretsecret'
    if(!token){
        return res.status(403).send({auth: false, message: 'No token provided'})
    }else{
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(500).send({auth: false, message: 'Failed to authenticate the token provided!'})
            }else{
                req.userId = decoded.id
                next()
            }
        })
    }
}