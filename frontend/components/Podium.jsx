import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext.jsx";
import CarPreview from "./CarPreview";
import { getAllCars } from './CarRegistry';


export default function Podium({ leaderboard }) {
    const navigate = useNavigate();
    leaderboard = [
        { id: 1, name: "Player 1", time: 120 },
        { id: 2, name: "Player 2", time: 125 },
        { id: 3, name: "Player 3", time: 130 },
        { id: 4, name: "Player 4", time: 140 },
    ];

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                    Race Results
                </h1>
                <div className="space-y-4">
                    {leaderboard.map((player, index) => (
                        <div
                            key={player.id}
                            className={`flex items-center justify-between p-4 rounded-md ${
                                index === 0
                                    ? "bg-yellow-300 dark:bg-yellow-600"
                                    : index === 1
                                    ? "bg-gray-300 dark:bg-gray-600"
                                    : index === 2
                                    ? "bg-orange-300 dark:bg-orange-600"
                                    : "bg-gray-100 dark:bg-gray-700"
                            }`}
                        >
                            <span className="font-bold text-lg text-gray-800 dark:text-white">
                                {index + 1}.
                            </span>
                            <span className="text-gray-800 dark:text-white">
                                {player.name}
                            </span>
                            <span className="font-bold text-gray-800 dark:text-white">
                                {player.time}s
                            </span>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => navigate("/kart-select")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                >
                    Start New Race
                </button>
            </div>
        </div>
    );
}
