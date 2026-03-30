import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { Run } from "../internal/handlers/server/Run.js"
import { ErrorHandler } from "../internal/handlers/server/errorHandler.js"
import { checkConfigHandler } from "../internal/handlers/server/checkConfig.js"
import { Server } from "socket.io"
import http from "http"

const server = http.createServer()
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.on("connect", function(socket) {
    socket.on("join-room", function(data) {
        console.log("Room Id", data.roomId)
        socket.join(data.roomId)
        socket.to(data.roomId).emit("user-joined")
    })

    socket.on("video-offer", function(data) {
        console.log("id", socket.id)
        socket.broadcast.emit("user-offer", {offer: data.offer, id: socket.id})
    })

    socket.on("user-answer", function(answer) {
        console.log("answer", answer)
        socket.broadcast.emit("user-set-answer", answer)
    })

    socket.on("ice-candidate", function(candidate) {
        socket.broadcast.emit("candidate", candidate)
    })
})

server.listen(3002)



try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    
    const configPath = path.join(__dirname, "../config.json")

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"))
    
    //Validation config 
    checkConfigHandler(config)

    const PORT = config.port
    const HOST = config.host
    const BACKLOG = config.backlog
    
    const app = express()
    
    app.listen(PORT, HOST, BACKLOG, (error) => {
        Run(config, error)
    })

    app.on('error', (error) => {
        ErrorHandler(error)
    })
    
} catch (error) {
    console.log(`Server error: ${error}`)
}