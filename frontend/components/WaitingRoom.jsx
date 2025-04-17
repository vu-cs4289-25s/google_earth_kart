import { Box, IconButton, Typography, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext.jsx";
import Minimap from "./MiniMap.jsx";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";

const WaitingRoom = () => {
    const navigate = useNavigate();
    const { socket } = useSocket();
    const me = socket.id;

    useEffect(() => {
        socket.on("finish race", () => {
            navigate("/podium");
        });
    },[socket]);

    function reset() {
        socket.emit("finish race");
    }
    
    return (
        <div className="h-screen w-screen bg-gradient-to-b from-blue-400 to-purple-300 overflow-hidden">
            <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 5 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            backgroundColor: "#ff8c00",
                            color: "white",
                            "&:hover": { backgroundColor: "#ff7000" },
                            padding: "10px",
                            borderRadius: "16px",
                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                            border: "4px solid white"
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
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            letterSpacing: '1px'
                        }}
                    >
                        A race is already in progress. Please wait!
                    </Typography>
                    
                    <IconButton

                        onClick={() => navigate("/settings")}
                        sx={{
                            backgroundColor: "#ff8c00",
                            color: "white",
                            "&:hover": { backgroundColor: "#ff7000" },
                            padding: "10px",
                            borderRadius: "16px",
                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                            border: "4px solid white",
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1 }} />
                    
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, zIndex: 256 }}>
                    <IconButton
                        onClick={reset}
                        sx={{
                            backgroundColor: "#4a90e2",
                            color: "white",
                            padding: "5px 20px",
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
                    >Reset Race</IconButton>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#fff",
                            textAlign: "center",
                            fontWeight: "bold",
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            letterSpacing: '1px'
                        }}
                    >
                        WARNING: This will reset the race for players currently in game!
                    </Typography>
                    </Box>
                {/* <Canvas>
                    <Minimap/>
                </Canvas> */} {/* To add later?? Would love to have an option for waiting players to watch race */}
            </Container>
        </div>
    );
};

export default WaitingRoom;