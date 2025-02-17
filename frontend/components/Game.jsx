import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import {Physics, Debug} from '@react-three/cannon';
import "../src/index.css"
import { io } from 'socket.io-client';
import City from "../components/City.jsx";
import Car from "../components/Car.jsx";
import Broadcast from "../components/Broadcast.jsx";

const socket = io("http://localhost:3001"); // Needs to match backend port

function Game() {
    const [messages, setMessages] = useState([]);
    const [players, setPlayers] = useState([]);
    const playersRef = useRef([]);
    const me = socket.id;

    useEffect(() => {

    /* User connection / disconnection */

    socket.on("connected", (playerList) => {
      playersRef.current = playerList;
      setPlayers(playerList); // sync player list
    });

    socket.on("disconnected", (playerList) => {
      playersRef.current = playerList;
      setPlayers(playerList);
    });

    /* Update player locations */
    socket.on("update players", (playerList) => {
      setPlayers(playerList);
      playersRef.current = playerList;
    });
    
    return () => {
      socket.off("chat message");
      socket.off("connected");
      socket.off("disconnected");
      socket.off("update players");
    };

  }, []);

    return (
        <>
        <Broadcast/>
        <text style={{ right:"15px", zIndex:256, position: "absolute"}}>Players Connected: {players.length}</text>
        <Canvas camera={{ position: [0, 3, 15], fov:45, near: 1, far: 1000 }}>
            <color attach="background" args={['#aeccfc']} />
            <ambientLight intensity={0.5} color={"white"}/>
            <directionalLight color="white" position={[0, 32, 64]}  intensity={1}/>
            <Physics>
                    <City/>
                    {/* {players.map((player) => ( */}
                    {/* Only mapping one car for now to ensure position vectors are correct. Need to separate "this" Car and others*/}
                      <Car key={/*player.id*/ me} position={[0,-0.4,0]} id={/*player.id*/ me} socket={socket}/>
                    {/* ))} */}
            </Physics>
            <Stats />
        </Canvas>
        </>
    )
}

export default Game
