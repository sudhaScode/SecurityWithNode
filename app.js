// set up mongoose connnect 
// n

const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('./config/passport')
const authRoutes = require('./routes/authRoutes')


dotenv.config()
//server
const app = express()

app.use(express.json())

app.use(passport.initialize());


mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("MongoDB Connected")).catch(err=>console.log(err))

app.use("/api/auth",authRoutes)


app.listen(3000, ()=> console.log("Server is running on port 3000"))