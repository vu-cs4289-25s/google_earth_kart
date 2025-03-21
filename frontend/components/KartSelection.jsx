import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext.jsx";
import CarPreview from "./CarPreview";
import { getAllCars } from './CarRegistry';

const KartSelection = () => {
    const [selectedKart, setSelectedKart] = useState('kia-soul');  // Default to Kia Soul
    const navigate = useNavigate();
    const { socket } = useSocket();
    const me = socket.id;

    function next() {
        if (selectedKart === null) return;
        socket.emit("player ready", me);
        navigate("/game");
    };
  
    const cars = getAllCars();
    
    // Save in localStorage when changes
    useEffect(() => {
        if (selectedKart) {
            localStorage.setItem('selectedCar', selectedKart);
        }
    }, [selectedKart]);
    
    // Initialize from localStorage if available
    useEffect(() => {
        const savedCar = localStorage.getItem('selectedCar');
        if (savedCar) {
            setSelectedKart(savedCar);
        }
    }, []);

    return (
        <div className="h-screen w-screen bg-gradient-to-b from-blue-400 to-purple-300 overflow-hidden">
            <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 5 }}>
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
                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
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
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '8px solid #ff7000'
                    }}
                >
                    {/* Selected Car Preview - Larger display of currently selected car */}
                    <Box sx={{ 
                        height: '30vh', 
                        width: '70%',
                        alignSelf: 'center',
                        mb: 3, 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
                    }}>
                        <CarPreview carId={selectedKart} />
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                position: 'absolute', 
                                bottom: 10, 
                                left: 0, 
                                right: 0, 
                                textAlign: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}
                        >
                            {cars.find(car => car.id === selectedKart)?.name || 'Select a Kart'}
                        </Typography>
                    </Box>
                    
                    {/* Car Selection Grid */}
                    <Typography
                        variant="h5"
                        sx={{
                            color: "white",
                            fontWeight: "bold",
                            mb: 2,
                        }}
                    >
                        AVAILABLE KARTS
                    </Typography>
                    <Box sx={{ 
                        overflow: 'auto', 
                        flex: 1,
                        padding: '16px',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#ff7000',
                            borderRadius: '10px',
                        },
                    }}>
                        <div className="grid grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px',  }}>
                        {cars.map((car) => (
                            <button
                                key={car.id}
                                className="overflow-hidden transition-all duration-200 transform"
                                style={{
                                    position: 'relative',
                                    height: "180px",
                                    borderRadius: "16px",
                                    background: car.unlocked ? "white" : "#f0f0f0",
                                    border: selectedKart === car.id ? "4px solid #3b82f6" : "4px solid white",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    opacity: car.unlocked ? 1 : 0.6,
                                    cursor: car.unlocked ? "pointer" : "not-allowed",
                                    transform: selectedKart === car.id ? "scale(1.02)" : "scale(1)",
                                    overflow: 'hidden',
                                }}
                                onClick={() => {
                                    if (car.unlocked) {
                                        setSelectedKart(car.id);
                                    }
                                }}
                            >
                                {/* Car Preview */}
                                <div style={{ width: '100%', height: '100%' }}>
                                    {car.unlocked ? (
                                        <CarPreview carId={car.id} />
                                    ) : (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            height: '100%',
                                            color: '#b45309',
                                            fontWeight: 'bold',
                                            padding: '16px',
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <span style={{ fontSize: '42px' }}>?</span><br />
                                                <span style={{ fontSize: '14px' }}>Coming Soon</span>
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
                                        background: "linear-gradient(to right, #333333, #505050)",
                                        color: "white",
                                        padding: "6px 0",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderTop: "2px solid #ffaa55",
                                        zIndex: 5
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
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                            border: "2px solid white",
                                            zIndex: 10
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
                        "&:hover": { backgroundColor: "#357ABD" },
                        padding: "15px 30px",
                        borderRadius: "20px",
                        alignSelf: 'center',
                        mt: 4,
                        boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            backgroundColor: "#357ABD",
                            transform: 'scale(1.05)'
                        },
                        border: "4px solid white"
                    }}
                >
                    <SportsEsportsIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography sx={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
                        START RACE!
                    </Typography>
                </IconButton>
            </Container>
        </div>
    );
};

export default KartSelection;