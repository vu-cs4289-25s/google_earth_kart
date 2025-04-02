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

const allowedOrigins = [
    "http://localhost:5173",
    "https://google-earth-kart.onrender.com",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, origin); // Allow the request
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
    })
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
let leaderboard = [];
let checkpoints = {};
let checkpointOrders = {};

function calculatePlayerOrder(playerId) {
    for (let checkpointId = Math.max(...Object.keys(checkpointOrders)); checkpointId >= 1; checkpointId--) {
        const orderArray = checkpointOrders[checkpointId];
        if (orderArray && orderArray.includes(playerId)) {
            return orderArray.indexOf(playerId);
        }
    }
    return Infinity; 
}

app.get("/game-status", (req, res) => {
    res.json({ status: gameStatus });
});

io.on("connection", (socket) => {
    // all websocket functions that occur while connected need to go in here
    console.log("A user connected");
    checkpoints[socket.id] = 0;
    players.push({ id: socket.id, position: [0, -0.4, 0] });
    io.emit("connected", players);

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    
        players = players.filter((p) => p.id !== socket.id);
        playersInGame = playersInGame.filter((p) => p.id !== socket.id);
        playersWaiting = playersWaiting.filter((p) => p.id !== socket.id);
        delete checkpoints[socket.id];

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
    socket.on("checkpoint hit", (checkpointId) => {
        if (checkpoints[socket.id] !== undefined) {
            if (checkpoints[socket.id] < checkpointId) {
                checkpoints[socket.id] = checkpointId; 
    
                if (!checkpointOrders[checkpointId]) {
                    checkpointOrders[checkpointId] = [];
                }
    
                if (!checkpointOrders[checkpointId].includes(socket.id)) {
                    checkpointOrders[checkpointId].push(socket.id);
                }
    
                leaderboard = playersInGame.map((player) => ({
                    id: player.id,
                    username: player.username || `Player ${player.id}`,
                    checkpoints: checkpoints[player.id] || 0,
                    order: calculatePlayerOrder(player.id), 
                }));
    
                leaderboard.sort((a, b) => {
                    if (b.checkpoints === a.checkpoints) {
                        return calculatePlayerOrder(a.id) - calculatePlayerOrder(b.id); 
                    }
                    return b.checkpoints - a.checkpoints; 
                });
    
                io.emit("leaderboard update", leaderboard);
            }
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
        leaderboard = [];
        checkpoints = {};
        checkpointOrders = {};
        players.forEach((player) => {
            checkpoints[player.id] = 0; 
        });
        io.emit("race start");
    });

    socket.on("player ready", (id, selectedKart, username) => {
        const playerIndex = playersInGame.findIndex((p) => p.id === id);

        if (playerIndex === -1) {
            playersInGame.push({ id: id, kart: selectedKart, position: [0, -0.4, 0], username: username });
        } else {
            playersInGame[playerIndex].kart = selectedKart; // Update kart selection
        }

        io.emit("player ready", playersInGame, id, players);
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
    });

    socket.on("reset game", () => {
        gameStatus = "waiting";
        io.emit("reset game");
        leaderboard = [];
        checkpoints = {};
    })
});

server.listen(3001, () => {
    console.log("Backend server running at http://localhost:3001");
});
