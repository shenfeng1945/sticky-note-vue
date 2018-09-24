const jwt = require('jsonwebtoken')
const config = require('../config')
const Note = require('../model/note')

module.exports = function(req,res,next){
    const authorizationHeader = req.headers['authorization']
    let token;
    if(authorizationHeader){
        token =authorizationHeader.split(' ')[1]
    }
    
    if(token){
        jwt.verify(token,config.jwtSecret,(err_verfiy,decoded)=>{
            if(err_verfiy){
                res.status(401).json({error: 'Failed to authenticate'})
            }else{
                req.userId = decoded.id;
                next()
            }
        })
    }else{
       next();
    }
}