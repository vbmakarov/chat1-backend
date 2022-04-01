import express from 'express'
import cors from 'cors'
import path from 'path'
import 'dotenv/config'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import router from './routes'
import { errorMiddleware } from './middleware/errorMiddleware'
import './database/connect'
import { app, httpServer } from './server'

app.use(express.static(path.join(__dirname, 'upload/avatars')))
app.use(express.static(path.join(__dirname, 'upload/emoji')))
app.use(express.static(path.join(__dirname, 'upload/files')))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
}
))
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router)
app.use(errorMiddleware)

httpServer.listen(process.env.PORT, () => {
    console.log(`server started on ${process.env.PORT} port`)
})