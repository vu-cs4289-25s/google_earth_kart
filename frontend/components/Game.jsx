import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Physics, Debug } from "@react-three/cannon";
import "../src/index.css";
import City from "../components/City.jsx";
import Car from "../components/Car.jsx";
import ExternalCar from "../components/ExternalCar.jsx";
import Broadcast from "../components/Broadcast.jsx";
import { useSocket } from "./SocketContext.jsx";
import { AxesHelper } from 'three';
import MiniMap from "../components/MiniMap.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import useConfirmExit from '../components/ConfirmExit.jsx';
import BackgroundMusic from "../components/BackgroundMusic";
import { useNavigate } from "react-router-dom";
import raceStartSoundMP3 from '/mario_kart_start.mp3'

function Axis() {
    const axisRef = useRef();

    useEffect(() => {
        if (axisRef.current) {
            axisRef.current.position.set(0, 0, 0); // Adjust position if needed
        }
    }, []);

    return <primitive object={new AxesHelper(5)} ref={axisRef} />;
}


function Game() {
    const carRef = useRef();
    const { socket, players } = useSocket();
    const [playerCount, setPlayerCount] = useState(0);
    const [readyPlayers, setReadyPlayers] = useState([]);
    const [playersInGame, setPlayersInGame] = useState([]);
    const playersRef = useRef([]);
    const me = socket.id;
    const [countDown, setCountDown] = useState("Waiting for Players...");
    const [showButton, setShowButton] = useState(false);
    const [allowMove, setAllowMove] = useState(false);
    const [gameStatus, setGameStatus] = useState("waiting");
    const [cityLoaded, setCityLoaded] = useState(false);
    const navigate = useNavigate();
    const [trafficLightState, setTrafficLightState] = useState("off");
    const [showFinish, setShowFinish] = useState(false);

    const [selectedCar, setSelectedCar] = useState(() => {
        return localStorage.getItem("selectedCar") || "kia-soul";
    });

    const raceStartAudio = useRef(null);

    // confirm with user before leaving
    useConfirmExit();

    const MINIMAP_ORIGIN_X = 210;
    const MINIMAP_ORIGIN_Y = 168;

    const worldToMinimap = (x, z) => {
        const SCALE = 0.195;

        return {
            left: MINIMAP_ORIGIN_X - x * SCALE,
            top: MINIMAP_ORIGIN_Y - z * SCALE,
        };
      };

    useEffect(() => {
        raceStartAudio.current = new Audio(raceStartSoundMP3);
        raceStartAudio.current.volume = 0.7;
    }, []);


    useEffect(() => {
        // Player connects
        socket.on("connected", (playerList) => {
            playersRef.current = playerList;
            setPlayerCount(playerList.length);
        });

        // Player disconnects
        socket.on("disconnected", (playerList) => {
            playersRef.current = playerList;
            setPlayerCount(playerList.length);
            setReadyPlayers([...playerList]);
            setPlayersInGame([...playerList]);
            if (playerList === 1) {
                setGameStatus("waiting");
                setAllowMove(false);
            }
        });

        // Update player locations
        socket.on("update players", (playerList) => {
            setPlayersInGame(playerList);
        });
        // socket.on("player moved", (update) => {
        //     setPlayersInGame(prevPlayers => {
        //         const playerIndex = prevPlayers.findIndex(p => p.id === update.id);
        //         if (playerIndex !== -1) {
        //             const newPlayers = [...prevPlayers];
        //             newPlayers[playerIndex] = {
        //                 ...newPlayers[playerIndex],
        //                 position: update.position,
        //                 quaternion: update.quaternion,
        //             };
        //             return newPlayers;
        //         }
        //         return prevPlayers;
        //     });
        // });

        // Race starts for all players
        socket.on("race start", () => {
            countdown();
        });

        // A player selected kart and is ready
        socket.on("player ready", (readyPlayers, id, players) => {
            setGameStatus("waiting");
            setShowFinish(false);
            setPlayerCount(players.length);
            setPlayersInGame(readyPlayers);
            if (playersInGame.length === playersRef.current.length) {
                setShowButton(true);
            }
        });

        socket.on("finish race", () => {
            navigate("/podium");
        });

        socket.on("player finished", (playerId) => {
            setShowFinish(true);
            if (playerId === me) {
                setAllowMove(false);
                setGameStatus("finished");
            }
        });

        return () => {
            socket.off("connected");
            socket.off("disconnected");
            socket.off("update players");
            // socket.off("player moved");
            socket.off("race start");
            socket.off("player ready");
        };
    });

    function countdown() {
        setShowButton(false);
        setCountDown("Ready?");
        setTrafficLightState("off");

        if (raceStartAudio.current) {
            raceStartAudio.current.currentTime = 0;
            raceStartAudio.current.play().catch(error => {
                console.warn("Race start audio play error:", error);
            });
        }
        
        setTimeout(() => { 
            setCountDown(""); 
            setTrafficLightState("red"); 
        }, 0);
        
        setTimeout(() => { 
            setTrafficLightState("amber"); 
        }, 1000);
        
        setTimeout(() => { 
            setTrafficLightState("green"); 
            setAllowMove(true); 
        }, 2000);
        
        setTimeout(() => { 
            setTrafficLightState("off");
            setGameStatus("in progress");
        }, 3000);
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
            <BackgroundMusic src = "MKWOST.mp3" volume={0.5} playOnStart={true} />
            
            <Broadcast show={gameStatus === "waiting"}/>
            <h4 style={{ right: "20px", bottom: "5px", zIndex: 256, position: "absolute", color: "white",
                display: gameStatus === "waiting" ? "block" : "none"
            }}>
                Players Ready: {playersInGame.length === 0 ? 1 : playersInGame.length} / {playerCount}
            </h4>

            <h4 style={{ left: "100px", top: "-10px", zIndex: 256, position: "absolute", color: "white",
                display: gameStatus === "in progress" ? "block" : "none"
            }}>
                Stuck? Press R to reset to the start!
            </h4>

            {/* Traffic Light Component */}
            <div style={{
                display: trafficLightState !== "off" ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: "10px",
                borderRadius: "10px",
                width: "100px",
            }}>
                <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: trafficLightState === "red" ? "#ff3333" : "rgba(255, 0, 0, 0.3)",
                    margin: "5px",
                    boxShadow: trafficLightState === "red" ? "0 0 20px #ff3333" : "none",
                    border: "3px solid black",
                }}></div>
                <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: trafficLightState === "amber" ? "#ffaa33" : "rgba(255, 170, 0, 0.3)",
                    margin: "5px",
                    boxShadow: trafficLightState === "amber" ? "0 0 20px #ffaa33" : "none",
                    border: "3px solid black",
                }}></div>
                <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: trafficLightState === "green" ? "#33ff33" : "rgba(0, 255, 0, 0.3)",
                    margin: "5px",
                    boxShadow: trafficLightState === "green" ? "0 0 20px #33ff33" : "none",
                    border: "3px solid black",
                }}></div>
            </div>

            <div style={{display: "flex", justifyContent: "center"}}>
            <h2 style={{
                zIndex: 256, 
                position: "absolute", 
                color: "white",
                textShadow: "0 0 4px #ff8c00, 0 0 4px #ff8c00",
                fontWeight: "bold",
            }}>{countDown}</h2>
            <h4 style={{
                zIndex: 256, 
                position: "absolute", 
                color: "white", 
                top:"40px",
                display: playersInGame.length === 1 && gameStatus === "waiting" ? "" : "none",
                textShadow: "0 0 2px #ff8c00, 0 0 2px #ff8c00",
                fontWeight: "bold",
            }}>At least 2 Players required to play.</h4>
                
                {/* Ready Button with Updated Styling */}
                <button 
                    onClick={ready} 
                    style={{
                        zIndex: 256, 
                        position: "absolute", 
                        top: "60px", 
                        display: showButton && gameStatus === "waiting" && playersInGame.length > 1 ? "block" : "none",
                        backgroundColor: "#4a90e2",
                        color: "white", 
                        padding: "10px 20px",
                        borderRadius: "16px",
                        border: "4px solid white",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "16px",
                        transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    START RACE!
                </button>

                <button 
                    onClick={finish} 
                    style={{
                        zIndex: 256, 
                        position: "absolute", 
                        top: "60px", 
                        display: showFinish ? "block" : "none",
                        backgroundColor: "#ff8c00",
                        color: "white", 
                        padding: "10px 20px",
                        borderRadius: "16px",
                        border: "4px solid white",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "16px",
                        transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    FINISH RACE
                </button>
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
                    {/*<Debug color={"green"} scale={1}>*/}
                    <City setLoaded={setCityLoaded} />
                    {cityLoaded && <Car
                        ref={carRef}
                        key={socket?.id}
                        position={[0,0,0]}
                        id={socket?.id}
                        socket={socket}
                        allowMove={allowMove}
                        carId={selectedCar}
                    />}

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
                    {/*</Debug>*/}
                </Physics>
                {/* Render the minimap overlay */}
                {/* <MiniMap target={carRef} /> */}
                <Stats />
            </Canvas>
            <Leaderboard />
            <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          width: "240px",
          height: "255px",
          backgroundImage: `url('${import.meta.env.VITE_ENVIRONMENT === "development" ? "../" :import.meta.env.VITE_BACKEND_URL}assets/minimap.png')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 1000,
        }}
      >
        {playersInGame.map((player) => {
            if (player.position) {
          const { left, top } = worldToMinimap(player.position[0], player.position[2]);
          return (
            <div
                key={player.id}
                style={{
                position: "absolute",
                left,
                top,
                transform: "translate(-50%, -50%)",
                color: "white",
                fontSize: "12px", // Adjust font size as needed
                fontWeight: "bold", // Make the username bold
                }}
                title={`Car ${player.id}`}
            >
                {player.username} {/* Display username */}
            </div>
          );
        }
        })}
      </div>
        </>
    );
}

export default Game;
