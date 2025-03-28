import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";
import { readFileSync } from "fs";
import admin from "firebase-admin";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_TOKEN);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
const server = createServer(app);
// app.use(express.static(path.join(__dirname, 'dist')));

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://google-earth-kart.onrender.com",
        ],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    }),
);

const io = new Server(server, {
    // Allow websockets to connect
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true,
    },
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "./index.html"));
});

let players = [];
let playersReady = [];
let playersInGame = [];
let playersWaiting = [];
let gameStatus = "waiting";

app.get("/game-status", (req, res) => {
    res.json({ status: gameStatus });
});

io.on("connection", (socket) => {
    // all websocket functions that occur while connected need to go in here
    console.log("A user connected");
    players.push({ id: socket.id, position: [0, -0.4, 0] });
    io.emit("connected", players);

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    
        players = players.filter((p) => p.id !== socket.id);
        playersInGame = playersInGame.filter((p) => p.id !== socket.id);
        playersWaiting = playersWaiting.filter((p) => p.id !== socket.id);

        io.emit("disconnected", players);
        io.emit("player ready", playersInGame);

        if (players.length === 0) gameStatus = "waiting";
    });
    socket.on("chat message", async (input, username) => {
        io.emit("chat message", input, username);

        // Save message to Firestore because funny haha
        try {
            await db.collection("messages").add({
                message: input,
                timestamp: new Date(),
            });
            console.log("Message saved to Firestore");
        } catch (error) {
            console.error("Error saving message to Firestore:", error);
        }
    });

    socket.on("player moves", ({ playerid, position, quaternion }) => {
        let p = playersInGame.findIndex((p) => p.id === playerid);
        if (p !== -1) {
            playersInGame[p].position = position;
            playersInGame[p].quaternion = quaternion;
            io.emit("update players", playersInGame);
        }
    });

    socket.on("race start", () => {
        gameStatus = "in progress";
        io.emit("race start");
    });

    socket.on("player ready", (id, selectedKart) => {
        const playerIndex = playersInGame.findIndex((p) => p.id === id);

        if (playerIndex === -1) {
            playersInGame.push({ id: id, kart: selectedKart, position: [0, -0.4, 0] });
        } else {
            playersInGame[playerIndex].kart = selectedKart; // Update kart selection
        }

        io.emit("player ready", playersInGame, id);
    });

    socket.on("player waiting", (id, selectedKart) => {
        const playerIndex = playersInGame.findIndex((p) => p.id === id);

        if (playerIndex === -1) {
            playersWaiting.push({ id: id, kart: selectedKart });
        } else {
            playersWaiting[playerIndex].kart = selectedKart; // Update kart selection
        }
    })

    socket.on("finish race", () => {
        gameStatus = "finished";
        playersInGame = [];
        playersWaiting = [];
        playersReady = [];
        io.emit("finish race");
    })
});

server.listen(3001, () => {
    console.log("Backend server running at http://localhost:3001");
});
