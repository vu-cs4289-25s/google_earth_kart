import { useEffect, useState } from "react";
import Game from "../components/Game.jsx";
import Login from "../components/Login.jsx";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Needs to match backend port

function App() {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (!username) return;

        const form = document.getElementById("form");
        const input = document.getElementById("input");

        //right now just concatenating the username with the message and sending it to the server, could change in future
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (input.value) {
                socket.emit("chat message", `${username}: ${input.value}`);
                input.value = "";
            }
        });

        socket.on("chat message", (msg) => {
            setMessages((prev) => [...prev, msg]);
            msgTimeout(msg);
        });

        // User connected
        socket.on("connected", () => {
            setMessages((prev) => [...prev, "A user connected"]);
            msgTimeout("A user connected");
        });

        // User disconnected
        socket.on("disconnected", () => {
            setMessages((prev) => [...prev, "A user disconnected"]);
            msgTimeout("A user disconnected");
        });

        function msgTimeout(msg) {
            setTimeout(() => {
                setMessages((prev) => prev.filter((m) => m !== msg));
            }, 5000);
        }

        return () => {
            socket.off("chat message");
            socket.off("connected");
            socket.off("disconnected");
        };
    }, [username]);

    if (!username) {
        return <Login onLogin={setUsername} />;
    }

    return (
        <>
            <ul id="broadcast">
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <form id="form" action="">
                <input id="input" autoComplete="off" />
                <button>Send</button>
            </form>
            <Game />
        </>
    );
}

export default App;
