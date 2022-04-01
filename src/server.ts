import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

export const app = express()
export const httpServer = http.createServer(app)

const socketConnect = (httpServer: http.Server): Server => {

    const ws = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_HOST,
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    })

    ws.on('connection', function (socket) {
        socket.on('TYPING MESSAGE', (obj: any) => {
            socket.broadcast.emit('TYPING MESSAGE', obj);
        });

    });

    return ws
}

export const io = socketConnect(httpServer)