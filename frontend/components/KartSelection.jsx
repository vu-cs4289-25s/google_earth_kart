import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext.jsx";
import CarPreview from "./CarPreview";
import { getAllCars } from "./CarRegistry";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
    collection,
    query,
    where,
    getDocs,
    getFirestore,
} from "firebase/firestore";

const KartSelection = () => {
    const [selectedKart, setSelectedKart] = useState("kia-soul"); // Default to Kia Soul
    const navigate = useNavigate();
    const { socket } = useSocket();
    const [username, setUsername] = useState("User");
    const db = getFirestore();

    // Fetch the user's username from Firestore
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userRef = collection(db, "users");
                    const q = query(userRef, where("uid", "==", user.uid));
                    const curUser = await getDocs(q);

                    if (!curUser.empty) {
                        const userData = curUser.docs[0].data();
                        setUsername(userData.username);
                    } else {
                        setUsername(user.displayName);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUsername(user.displayName || "User");
                }
            }
        });
        return () => unsubscribe();
    }, [db]);

    function next() {
        fetch(`${import.meta.env.VITE_BACKEND_URL}game-status`) // CHANGE LATER TO URL
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "waiting") {
                    navigate("/game");
                    socket.emit("player ready", socket.id, selectedKart, username);
                    
                } else {
                    navigate("/waitingroom");
                    socket.emit("player waiting", socket.id, selectedKart, username);
                }
            })
            .catch((error) => console.error("Error fetching game status:", error));
    }
    const cars = getAllCars();

    // Save in localStorage when changes
    useEffect(() => {
        if (selectedKart) {
            localStorage.setItem("selectedCar", selectedKart);
        }
    }, [selectedKart]);

    // Initialize from localStorage if available
    useEffect(() => {
        const savedCar = localStorage.getItem("selectedCar");
        if (savedCar) {
            setSelectedKart(savedCar);
        }
    
        if (socket) {
            socket.on("finish race", (leaderboard) => {
                navigate("/podium");
            });
        }
    }, []);

    return (
        <div className="h-screen w-screen bg-gradient-to-b from-blue-400 to-purple-300 overflow-hidden">
            <Container
                maxWidth="lg"
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    py: 5,
                    zIndex: 20,
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        zIndex: 30,
                    }}
                >
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            backgroundColor: "#ff8c00",
                            color: "white",
                            "&:hover": { backgroundColor: "#ff7000" },
                            padding: "10px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                            border: "4px solid white",
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Typography
                        variant="h3"
                        sx={{
                            color: "#fff",
                            textAlign: "center",
                            fontWeight: "bold",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                            letterSpacing: "1px",
                        }}
                    >
                        Select Your Kart
                    </Typography>

                    <IconButton
                        onClick={() => navigate("/settings")}
                        sx={{
                            backgroundColor: "#ff8c00",
                            color: "white",
                            "&:hover": { backgroundColor: "#ff7000" },
                            padding: "10px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                            border: "4px solid white",
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Box>

                {/* Karts Selection */}
                <Box
                    sx={{
                        backgroundColor: "rgba(255, 140, 0, 0.9)",
                        padding: 4,
                        borderRadius: "24px",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                        height: "62vh",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        border: "8px solid #ff7000",
                        zIndex: 30,
                    }}
                >
                    {/* Selected Car Preview - Larger display of currently selected car */}
                    <Box
                        sx={{
                            height: "70%",
                            width: "60%",
                            alignSelf: "center",
                            mb: 2,
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "16px",
                            overflow: "hidden",
                            position: "relative",
                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
                            zIndex: 30,
                        }}
                    >
                        <CarPreview carId={selectedKart} />
                        <Typography
                            variant="h4"
                            sx={{
                                position: "absolute",
                                bottom: 10,
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                color: "white",
                                fontWeight: "bold",
                                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                            }}
                        >
                            {cars.find((car) => car.id === selectedKart)
                                ?.name || "Select a Kart"}
                        </Typography>
                    </Box>

                    {/* Car Selection Grid */}
                    <Typography
                        variant="h5"
                        sx={{
                            color: "white",
                            fontWeight: "bold",
                            mb: 1,
                        }}
                    >
                        AVAILABLE KARTS
                    </Typography>
                    <Box
                        sx={{
                            overflow: "auto",
                            height: "calc(60% - 50px)",
                            padding: "16px",
                            zIndex: 30,
                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "rgba(255,255,255,0.1)",
                                borderRadius: "10px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: "#ff7000",
                                borderRadius: "10px",
                            },
                        }}
                    >
                        <div
                            className="grid grid-cols-3 gap-6"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5, 1fr)",
                                gap: "24px",
                            }}
                        >
                            {cars.map((car) => (
                                <button
                                    key={car.id}
                                    className="overflow-hidden transition-all duration-200 transform"
                                    style={{
                                        position: "relative",
                                        height: "120px",
                                        borderRadius: "16px",
                                        background: car.unlocked
                                            ? "rgba(253, 169, 67, 0.9)"
                                            : "#f0f0f0",
                                        border:
                                            selectedKart === car.id
                                                ? "9px solid #3b82f6"
                                                : "4px solid white",
                                        opacity: car.unlocked ? 1 : 0.6,
                                        cursor: car.unlocked
                                            ? "pointer"
                                            : "not-allowed",
                                        transform:
                                            selectedKart === car.id
                                                ? "scale(1.1)"
                                                : "scale(1)",
                                        overflow: "hidden",
                                        boxShadow:
                                            "inset 10px 10px 10px rgba(0,0,0,0.1)",
                                    }}
                                    onClick={() => {
                                        if (car.unlocked) {
                                            setSelectedKart(car.id);
                                        }
                                    }}
                                >
                                    {/* Car Preview */}
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "50%",
                                        }}
                                    >
                                        {car.unlocked ? (
                                            <CarPreview carId={car.id} />
                                        ) : (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    height: "10%",
                                                    color: "#b45309",
                                                    fontWeight: "bold",
                                                    padding: "16px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: "42px",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        ? ? ?
                                                    </span>
                                                    <br />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Car Name Banner */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background:
                                                "linear-gradient(to right, #333333, #505050)",
                                            color: "white",
                                            padding: "6px 0",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderTop: "2px solid #ffaa55",
                                            zIndex: 5,
                                        }}
                                    >
                                        {car.name}
                                    </div>

                                    {/* Selected Badge */}
                                    {selectedKart === car.id && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "8px",
                                                right: "8px",
                                                backgroundColor: "#3b82f6",
                                                color: "white",
                                                padding: "4px 10px",
                                                borderRadius: "16px",
                                                fontSize: "8px",
                                                fontWeight: "bold",
                                                boxShadow:
                                                    "0 2px 4px rgba(0,0,0,0.3)",
                                                border: "2px solid white",
                                                zIndex: 10,
                                            }}
                                        >
                                            Selected
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </Box>
                </Box>

                {/* Start Race Button */}
                <IconButton
                    onClick={next}
                    sx={{
                        backgroundColor: "#4a90e2",
                        color: "white",
                        padding: "15px 30px",
                        borderRadius: "20px",
                        alignSelf: "center",
                        mt: 3,
                        boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                        transition: "transform 0.2s",
                        "&:hover": {
                            backgroundColor: "#357ABD",
                            transform: "scale(1.05)",
                        },
                        border: "4px solid white",
                    }}
                >
                    <SportsEsportsIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography
                        sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 20,
                        }}
                    >
                        START RACE!
                    </Typography>
                </IconButton>
            </Container>
        </div>
    );
};

export default KartSelection;
