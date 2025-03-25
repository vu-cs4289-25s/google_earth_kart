import React from "react";
import { Box, Button, Container, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Podium = ({ leaderboard }) => {
    const navigate = useNavigate();
    //this is just dummy data for testing, you would pass the actual leaderboard data as a prop
    leaderboard = [
        { place: 1, name: "Player 1"},
        { place: 2, name: "Player 2"},
        { place: 3, name: "Player 3"},
        { place: 4, name: "Player 4"},
        { place: 425, name: "Player 6"},
        { place: 6, name: "Player 5"},
        
    ];

    //sort the leaderboard by place 
    leaderboard.sort((a, b) => a.place - b.place);

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-400 to-purple-300 overflow-hidden">
            <Container maxWidth="sm" sx={{ py: 5, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                {/* Header */}
                <Box sx={{ mb: 4, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    <Typography
                        variant="h3"
                        sx={{
                            color: "#fff",
                            fontWeight: "bold",
                            textAlign: "center",
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
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
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        width: '100%',
                        border: '8px solid #ff7000'
                    }}
                >
                    {leaderboard.map((player, index) => (
                        <Box
                            key={player.place}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: 2,
                                borderRadius: "16px",
                                mb: 2,
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
                                boxShadow: index < 3 ? "0 4px 8px rgba(0,0,0,0.2)" : "none",
                            }}
                        >
                            <Typography variant="h6">{index + 1}.</Typography>
                            <Typography>{player.name}</Typography>
                            {/* maybe put something else here like time or something */}
                            <Typography>{}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Start New Race Button */}
                {/* also do something here to reset the state of the race */}
                <Button
                    onClick={() => navigate("/kart-select")}
                    sx={{
                        mt: 4,
                        backgroundColor: "#4a90e2",
                        color: "white",
                        "&:hover": { backgroundColor: "#357ABD" },
                        padding: "10px 20px",
                        borderRadius: "16px",
                        boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                        fontWeight: "bold",
                        fontSize: 18,
                        textTransform: "none",
                    }}
                >
                    Start New Race
                </Button>
            </Container>
        </div>
    );
};

export default Podium;
