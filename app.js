// set up mongoose connnect 
// n
const cluster = require('cluster')
const os = require('os')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('./config/passport')
const authRoutes = require('./routes/authRoutes')
const {Worker, isMainThread, parentPort } =require('worker_threads')


dotenv.config()
//server

if(cluster.isPrimary){
   const cpus = os.cpus().length;
   // console.log("NUmber of cpus: ", cpus)
   for( let i=0;i<Math.floor(cpus/2);i++){
    cluster.fork()
   }
   cluster.on('exit', (worker, code, signal)=>{
    console.log(`Worker ${worker.process.pid} died. Restarting...`)
    cluster.fork()
   })
}
else{
    

    // if( isMainThread){
    //     console.log("Main Thread is Running")
    //     const worker = new Worker(__filename);
    //     worker.on('message', (result)=>{
    //         console.log(`Fibnonacci Results: ${result}`)
    //     })
    //     worker.postMessage(45)
    // }
    // else{
    //     console.log("Task offloaded to worker")
    //     parentPort.on('message', (n)=>{
    //         const res = fib(n)
    //         parentPort.postMessage(res)
    //     })
    // }


const app = express()

app.use(express.json())

app.use(passport.initialize());


mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("MongoDB Connected")).catch(err=>console.log(err))

app.use("/api/auth",authRoutes)

app.get('/api/fib', (req, res) => {
    const n = parseInt(req.query.n) || 35;
    const worker = new Worker('./fibWorker.js');
  
    worker.on('message', (msg) => {
      if (msg.type === 'FIB_RESULT') {
        res.json({ result: msg.data });
      }
    });
  
    worker.on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
  
    worker.postMessage({ type: 'FIB_TASK', payload: n });
  });


app.listen(3000, ()=> console.log("Server is running on port 3000", process.pid))
}