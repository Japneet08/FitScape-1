require('dotenv').config();

const path=require('path')
const cors=require('cors')
const userRouter=require('./routes/user.router')


const express=require('express');
const connectDB = require('./db/db');
const app=express()
connectDB()
const PORT=process.env.PORT||3000

app.set("view engine","ejs")
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))


app.get("/",(req,res)=>{
  res.render("index")
})
app.use("/user",userRouter)




app.listen(PORT,()=>{
  console.log(`Server running at port ${PORT}`)
})
