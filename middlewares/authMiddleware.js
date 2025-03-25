const passport = require('passport')

exports.authenicateJWT = passport.authenticate('jwt', {session:false});
exports.authorizeRoles =(roles) => (req, res, next)=>{
    if(!roles.includes(req.user.role)){
        return res.status(403).json({message:"Access Denied"});
    }
    next()
}