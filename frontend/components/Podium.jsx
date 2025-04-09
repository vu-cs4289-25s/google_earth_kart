import { React, useEffect, useState } from "react";
import { Box, IconButton, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext.jsx";


const Podium = () => {
    const navigate = useNavigate();
    const { socket } = useSocket();
    const [leaderboard, setLeaderboard] = useState([]); 

    useEffect(() => {
        // Fetch leaderboard data when component mounts
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("/leaderboard");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLeaderboard(data.leaderboard);
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            }
        };

        fetchLeaderboard();
    }, []);

    //sort the leaderboard by place
    leaderboard.sort((a, b) => a.place - b.place);

    function reset() {
        socket.emit("reset game");
    }

    useEffect(() => {
        if (socket) {
            socket.on("reset game", () => {
                navigate("/kart-select");
            });
        }
    },[socket]);

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-blue-400 to-purple-300">
            <Container
                maxWidth="sm"
                sx={{
                    py: 5,
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    overflowY: "auto",
                }}
            >

                {/* Header */}
                <Box
                    sx={{
                        mb: 4,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            color: "#fff",
                            fontWeight: "bold",
                            textAlign: "center",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                        }}
                    >
                        Race Results
                    </Typography>
                </Box>

                {/* Leaderboard */}
                <Box
                    sx={{
                        backgroundColor: "rgba(255, 140, 0, 0.9)",
                        padding: 4,
                        borderRadius: "24px",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                        width: "100%",
                        border: "8px solid #ff7000",
                        zIndex: 1,
                        overflowY: "auto",
                    }}
                >
                    {leaderboard.map((player, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: 1,
                                borderRadius: "16px",
                                mb: 1.5,
                                backgroundColor:
                                    index === 0
                                        ? "#ffeb3b"
                                        : index === 1
                                          ? "#c0c0c0"
                                          : index === 2
                                            ? "#CD7F32"
                                            : "#f0f0f0",
                                color: index < 3 ? "#000" : "#333",
                                fontWeight: "bold",
                                boxShadow:
                                    index < 3
                                        ? "0 4px 8px rgba(0,0,0,0.2)"
                                        : "none",
                            }}
                        >
                            <Typography variant="h6">{index + 1}.</Typography>
                            <Typography>{player.username}</Typography>
                            {/* maybe put something else here like time or something */}
                            <Typography>{}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Start New Race Button */}
                {/* also do something here to reset the state of the race */}
                <IconButton
                    onClick={reset}
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

                    <Typography
                        sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 20,
                        }}
                    >
                        Start New Race
                    </Typography>
                </IconButton>
            </Container>
        </div>
    );
};

export default Podium;
