import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import {Physics, Debug} from '@react-three/cannon';
import "./Game.css"
import { io } from 'socket.io-client';

import City from "../components/City.jsx";
import Car from "../components/Car.jsx";

const socket = io("http://localhost:3001"); // Needs to match backend port

function Game() {
    const [messages, setMessages] = useState([]);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
      /* Chat feature */
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

    function msgTimeout(msg) {
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m !== msg));
      }, 5000);
    }

    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      msgTimeout(msg);
    });

    /* User connection / disconnection */

    socket.on("connected", (playerList) => {
      setMessages((prev) => [...prev, "A user connected"]);
      msgTimeout("A user connected");

      setPlayers(playerList); // sync player list
    });

    socket.on("disconnected", (playerList) => {
      setMessages((prev) => [...prev, "A user disconnected"]);
      msgTimeout("A user disconnected");

      setPlayers(playerList);
    });
    
    return () => {
      socket.off("chat message");
      socket.off("connected");
      socket.off("disconnected");
    };

  }, []);

    return (
        <>
        <ul id="broadcast">
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
        <form id="form" action="">
          <input id="input" autoComplete="off"/>
          <button>Send</button>
        </form>
        <text style={{ right:"15px", zIndex:256, position: "absolute"}}>Players Connected: {players.length}</text>
        <Canvas camera={{ position: [0, 3, 15], fov:45, near: 1, far: 1000 }}>
            <color attach="background" args={['#aeccfc']} />
            <ambientLight intensity={0.5} color={"white"}/>
            <directionalLight color="white" position={[0, 32, 64]}  intensity={1}/>
            <Physics>
                    <City/>
                    {players.map((player) => (
                      <Car key={player.id} position={player.position} />
                    ))}
            </Physics>
            <Stats />
        </Canvas>
        </>
    )
}

export default Game
