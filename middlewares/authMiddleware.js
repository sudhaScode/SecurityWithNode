const passport = require('passport')

c
exports.authorizeRoles =(roles) => (req, res, next)=>{
    console.log(req)
    if(!roles.includes(req.user.role)){
   
        return res.status(403).json({message:"Access Denied"});
    }
    next()
} 


