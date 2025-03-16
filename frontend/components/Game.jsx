import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import "../src/index.css";
import City from "../components/City.jsx";
import Car from "../components/Car.jsx";
import ExternalCar from "../components/ExternalCar.jsx";
import Broadcast from "../components/Broadcast.jsx";
import { useSocket } from "./SocketContext.jsx";
import MiniMap from "../components/MiniMap.jsx";

function Game() {
    const carRef = useRef();
    const { socket, players } = useSocket();
    const [currentPlayers, setPlayers] = useState([]);
    const playersRef = useRef([]);
    const me = socket.id;

    useEffect(() => {
        /* Sync player list on connect */
        socket.on("connected", (playerList) => {
            playersRef.current = playerList;
            setPlayers(playerList);
        });

        /* Sync player list on disconnect */
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
            socket.off("connected");
            socket.off("disconnected");
            socket.off("update players");
        };
    }, [socket]);

    return (
        <>
            <Broadcast />
            <text style={{ right: "15px", zIndex: 256, position: "absolute" }}>
                Players Connected: {currentPlayers.length}
            </text>
            <Canvas
                camera={{ position: [0, 3, 15], fov: 45, near: 1, far: 1000 }}
            >
                <color attach="background" args={["#aeccfc"]} />
                <ambientLight intensity={0.5} color={"white"} />
                <directionalLight
                    color="white"
                    position={[0, 32, 64]}
                    intensity={1}
                />
                <Physics>
                    <City />
                    <Car
                        ref={carRef} // added ref for the minimap target
                        key={socket?.id}
                        position={[0, -0.4, 0]}
                        id={socket?.id}
                        socket={socket}
                    />
                    {currentPlayers.map((player) => {
                        if (player.id !== me) {
                            return (
                                <ExternalCar
                                    key={player.id}
                                    playerId={player.id}
                                    players={currentPlayers}
                                />
                            );
                        }
                        return null;
                    })}
                </Physics>
                {/* Render the minimap overlay */}
                <MiniMap target={carRef} />
                <Stats />
            </Canvas>
        </>
    );
}

export default Game;
