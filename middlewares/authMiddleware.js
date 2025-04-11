const passport = require('passport')

exports.authenticateJWT = passport.authenticate('jwt', {session:false});

exports.authorizeRoles =(roles) => (req, res, next)=>{
    console.log(req)
    if(!roles.includes(req.user.role)){
   
        return res.status(403).json({message:"Access Denied"});
    }
    next()
} 


