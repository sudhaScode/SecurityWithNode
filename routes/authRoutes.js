const router = require('express').Router()
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const User = require('../models/userModels')
const {authenticateJWT, authorizeRoles} = require('../middlewares/authMiddleware');

dotenv.config()
const generateToken = (user)=>{
    return jwt.sign({id: user._id, role:user.role}, process.env.jwt_secret, {expiresIn: '1h'});

}

router.post('/register', async(req, res)=>{
    try{
        console.log(" Req received for registering")
        const {username, email, password, role} = req.body;
        const user = await User.create({username, email, password, role})
        res.json({message: "User registered successfully"});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})

router.post("/login", async(req, res)=>{
    console.log(" Req received for Login")
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        console.log("Pasword:: ", user.password)
        const isPasswordMatching = await user.comparePassword(password)
        if( !user || !isPasswordMatching){
            return res.status(401).json({message: "Invalid credentials"});

        }
        const token = generateToken(user)
        res.json({token});
        return
    }
    catch(error){
        res.status(500).json({error: error.message});
    }

})

router.get("/profile", authenticateJWT, (req, res)=>{
    console.log("Req for profile", req.user)
    
    res.json({message: "Profile Access Grated", user: req.user
    })
});

router.get('/admin', authenticateJWT, authorizeRoles(['admin']), (req, res)=>{
    console.log(req)
    res.json({message: "Admin Access Granted", usr: res.usr})
})
module.exports = router