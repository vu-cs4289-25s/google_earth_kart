import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

const io = new Server(server, { // Allow websockets to connect
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true
    }
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "./chat.html"));
});

let players = [];

io.on("connection", (socket) => { // all websocket functions that occur while connected need to go in here
    console.log("A user connected");
    players.push({ id: socket.id, position: [0, -0.4, 0] })
    io.emit("connected", players); 

    socket.on("disconnect", () => {
        console.log("A user disconnected");
        players = players.filter((p) => p.id != socket.id);
        io.emit("disconnected", players);
    });

    socket.on("chat message", (input) => { // receieves signal from frontend
        io.emit("chat message", input); // sends back signal to frontend
    });
});

server.listen(3001, () => {
    console.log("Backend server running at http://localhost:3001");
});
