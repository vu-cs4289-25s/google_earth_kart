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
import useConfirmExit from '../components/ConfirmExit.jsx';
import { useNavigate } from "react-router-dom";

function Game() {
    const carRef = useRef();
    const { socket, players } = useSocket();
    const [totalPlayers, setTotalPlayers] = useState([]);
    const [readyPlayers, setReadyPlayers] = useState([]);
    const [playersInGame, setPlayersInGame] = useState([]);
    const playersRef = useRef([]);
    const me = socket.id;
    const [countDown, setCountDown] = useState("Waiting for Players...");
    const [showButton, setShowButton] = useState(false);
    const [allowMove, setAllowMove] = useState(false);
    const [gameStatus, setGameStatus] = useState("waiting");
    const navigate = useNavigate();

    const [selectedCar, setSelectedCar] = useState(() => {
        return localStorage.getItem("selectedCar") || "kia-soul";
    });

    // confirm with user before leaving
    useConfirmExit();

    useEffect(() => {
        // Player connects
        socket.on("connected", (playerList) => {
            playersRef.current = playerList;
            setTotalPlayers([...playerList]);
        });

        // Player disconnects
        socket.on("disconnected", (playerList) => {
            playersRef.current = playerList;
            setTotalPlayers([...playerList]);
            setReadyPlayers([...playerList]);
            setPlayersInGame([...playerList]);
        });

        // Update player locations
        socket.on("update players", (playerList) => {
            setPlayersInGame(playerList);
        });

        // Race starts for all players
        socket.on("race start", () => {
            countdown();
        });

        // A player selected kart and is ready
        socket.on("player ready", (readyPlayers, id) => {
            setPlayersInGame(readyPlayers);
            if (playersInGame.length === playersRef.current.length) {
                setShowButton(true);
            }
        });

        socket.on("finish race", () => {
            navigate("/podium");
        })

        return () => {
            socket.off("connected");
            socket.off("disconnected");
            socket.off("update players");
            socket.off("race start");
            socket.off("player ready");
        };
    }, [socket, gameStatus]);

    function countdown() {
        setShowButton(false);
        setCountDown("Ready?");
        setTimeout(() => { setCountDown("3"); }, 1000);
        setTimeout(() => { setCountDown("2");  }, 2000);
        setTimeout(() => { setCountDown("1"); }, 3000);
        setTimeout(() => { setCountDown("Go!"); setAllowMove(true); setGameStatus("in progress"); }, 4000);
        setTimeout(() => { setCountDown(""); }, 5000);
    }

    function ready() {
        socket.emit("race start");
        countdown();
    }

    function finish() {
        socket.emit("finish race");
    }

    return (
        <>
            <Broadcast show={gameStatus === "waiting"}/>
            <h4 style={{ right: "20px", bottom: "5px", zIndex: 256, position: "absolute", color: "white",
                display: gameStatus === "waiting" ? "block" : "none"
            }}>
                Players Ready: {playersInGame.length === 0 ? 1 : playersInGame.length} / {totalPlayers.length}
            </h4>
            <div style={{display: "flex", justifyContent: "center"}}>
                <h2 style={{zIndex: 256, position: "absolute", color: "white"}}>{countDown}</h2>
                <h4 style={{zIndex: 256, position: "absolute", color: "white", top:"40px",
                    display: playersInGame.length === 1 ? "" : "none"}}>At least 2 Players required to play.</h4>
                <button onClick={ready} style={{zIndex: 256, position: "absolute", top: "60px", 
                    display: showButton && gameStatus === "waiting" && playersInGame.length > 1 ? "block" : "none", background: "black", color:"white"}}>Ready!</button>

                    {/* Dummy button to manually finish race for now. Delete this once finish line implemented */}
                <button onClick={finish} style={{zIndex: 256, position: "absolute", top: "60px", 
                display: gameStatus === "in progress" ? "block" : "none", background: "black", color:"white"}}>Finish Race</button>

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
                        key={socket?.id}
                        position={[0, -0.4, 0]}
                        id={socket?.id}
                        socket={socket}
                        allowMove={allowMove}
                        carId={selectedCar}
                    />
                    {playersInGame.map((player) => {
                        if (player.id !== me) {
                            return (
                                <ExternalCar
                                    key={player.id}
                                    playerId={player.id}
                                    players={playersInGame}
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
