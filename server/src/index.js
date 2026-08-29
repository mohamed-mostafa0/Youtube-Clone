import 'dotenv/config'
import express from 'express'
import dbConnection from './DB/db.connection.js'
import { authController, userController, videoController } from './Modules/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
dbConnection()

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials:true
}
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())


app.use("/auth" , authController)
app.use("/video" , videoController)
app.use("/user" , userController)

app.use((req , res)=>{
    return res.status(404).json({message:"Route Not Found"})
})

app.use((err, req, res, next) => {
    return res.status(500).json({message:err.message , stack:err.stack})
})

app.listen(process.env.PORT || 4000 , ()=>{
    console.log(`Server Started ${process.env.PORT || 4000}`);
    
})