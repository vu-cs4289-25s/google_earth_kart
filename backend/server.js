import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server); // For websocket functions

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "./chat.html"));
});

io.on("connection", (socket) => { // all websocket functions that occur while connected need to go in here
    console.log("A user connected");
    io.emit("connected"); 
    socket.on("disconnect", () => {
        console.log("A user disconnected");
        io.emit("disconnected");
    });

    socket.on("chat message", (input) => { // receives signal from frontend
        io.emit("chat message", input); // send signal to frontend
    });
});

server.listen(3001, () => {
    console.log("Backend server running at http://localhost:3001");
});
