import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "../components/Game.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import './index.css'
import { io } from "socket.io-client";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const socket = io("http://localhost:3001"); // Needs to match backend port

function App() {
    //you can use auth.currentUser to get current user
    const auth = getAuth();
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (!username) return;

        const form = document.getElementById("form");
        const input = document.getElementById("input");

        form.addEventListener("submit",(e) => {
            e.preventDefault();
            if (input.value) {
              socket.emit("chat message", input.value);
              input.value = "";
              input.blur();
            }
          });
      
          document.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
              input.select();
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
            // IMPORTANT: Right now this function will filter out (delete) the message matching the one passed in as a parameter.
            // This means all messages with the same content are removed. We can adjust this, but it will involve creating
            // an object with a date-time key which is more involved. Can consider later.
            setTimeout(() => {
              setMessages((prev) => prev.filter((m) => m !== msg));
            }, 5000);
          }
          
          return () => {
            socket.off("chat message");
            socket.off("connected");
            socket.off("disconnected");
          };
      
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/game" element={
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
                } />
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
