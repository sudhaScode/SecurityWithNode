const {Strategy, ExtractJwt} = require('passport-jwt')

const passport = require('passport')

const User = require('../models/userModels')
const dotenv = require('dotenv')


dotenv.config()
const options ={
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.jwt_secret
};

passport.use(
    new Strategy(options, async(payload, done)=>{
        try{
            const user = await User.findById(payload.id);
            if (user) return done(null, user)
            return done(null, false)
        }
        catch (error) {
            return   done(error, false)
        }
    })
);

module.exports = passport