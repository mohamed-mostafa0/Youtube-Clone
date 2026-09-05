import 'dotenv/config'
import express from 'express'
import dbConnection from './DB/db.connection.js'
import { authController, userController, videoController, channelController, commentController } from './Modules/index.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import { initIO } from './Utils/index.js'

const app = express()
dbConnection()

const server = http.createServer(app)
initIO(server)

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())


app.use("/auth", authController)
app.use("/video", videoController)
app.use("/user", userController)
app.use("", channelController)
app.use("/comment", commentController)

app.use((req, res) => {
    return res.status(404).json({ message: "Route Not Found" })
})

app.use((err, req, res, next) => {
    return res.status(500).json({ message: err.message, stack: err.stack })
})

server.listen(process.env.PORT || 4000, () => {
    console.log(`Server Started ${process.env.PORT || 4000}`);

})