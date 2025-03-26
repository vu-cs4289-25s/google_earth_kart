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
    const { socket, players } = useSocket();
    // Wait for socket to be initialized before using it.
    if (!socket) return <div>Loading...</div>;
    // Use the persistent UUID stored in local storage.
    const me = localStorage.getItem("userId");

    const carRef = useRef();
    const [currentPlayers, setPlayers] = useState([]);
    const [readyPlayers, setReadyPlayers] = useState([]);
    const playersRef = useRef([]);
    const [countDown, setCountDown] = useState("Waiting for Players...");
    const [showButton, setShowButton] = useState(false);
    const [allowMove, setAllowMove] = useState(false);

    const [selectedCar, setSelectedCar] = useState(() => {
        return localStorage.getItem('selectedCar') || 'kia-soul';
    });


    useEffect(() => {
        // Player connects
        socket.on("connected", (playerList) => {
            playersRef.current = playerList;
            setPlayers(playerList);
        });

        // Player disconnects
        socket.on("disconnected", (playerList, playersReady) => {
            playersRef.current = playerList;
            setPlayers(playerList);
        });

        // Update player locations
        socket.on("update players", (playerList) => {
            setPlayers(playerList);
            playersRef.current = playerList;
        });
        
        // Race starts for all players
        socket.on("race start", () => {
            countdown();
        });

        // A player selected kart and is ready
        socket.on("player ready", (playersReady) => {
            setReadyPlayers(playersReady);
            if (playersReady.length === playersRef.current.length) {
                setShowButton(true);
            }
        });

        return () => {
            socket.off("connected");
            socket.off("disconnected");
            socket.off("update players");
            socket.off("race start");
            socket.off("player ready");
        };
    }, [socket]);

    function countdown() {
        setShowButton(false);
        setCountDown("Ready?");
        setTimeout(() => { setCountDown("3"); }, 1000);
        setTimeout(() => { setCountDown("2");  }, 2000);
        setTimeout(() => { setCountDown("1"); }, 3000);
        setTimeout(() => { setCountDown("Go!"); setAllowMove(true); }, 4000);
        setTimeout(() => { setCountDown(""); }, 5000);
    }

    function ready() { 
        socket.emit("race start");
        countdown();
    }

    return (
        <>
            <Broadcast />
            <h4 style={{ right: "20px", bottom: "5px", zIndex: 256, position: "absolute", color: "white"}}>
                Players Ready: {readyPlayers.length} / {currentPlayers.length}
            </h4>
            <div style={{display: "flex", justifyContent: "center"}}>
                <h2 style={{zIndex: 256, position: "absolute", color: "white"}}>{countDown}</h2>
                <button onClick={ready} style={{zIndex: 256, position: "absolute", top: "60px", 
                    display: showButton ? "block" : "none", background: "black", color:"white"}}>Ready!</button>
            </div>
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
                        ref={carRef}
                        key={me}
                        position={[0, -0.4, 0]}
                        id={me}
                        socket={socket}
                        allowMove={allowMove}
                        carId={selectedCar}
                    />
                    {readyPlayers.map((player) => {
                        if (player.id !== me) {
                            return (
                                <ExternalCar
                                    key={player.id}
                                    playerId={player.id}
                                    players={currentPlayers}
                                    carId={player.kart} 
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
