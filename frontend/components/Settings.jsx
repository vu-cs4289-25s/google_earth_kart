import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Switch, Typography, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    doc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";

export default function Settings() {
    const [music, setMusic] = useState(true);
    const [sound, setSound] = useState(true);
    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const navigate = useNavigate();
    const db = getFirestore();
    const auth = getAuth();

    // Play test sound with a beep
    const playTestSound = () => {
        if (!sound) return;

        const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 440; // A4 note
        gainNode.gain.value = 0.1; // Volume

        oscillator.start();
        setTimeout(() => oscillator.stop(), 200); // Short beep
    };

    const handleMusicToggle = (e) => {
        const isEnabled = e.target.checked;
        setMusic(isEnabled);
        document.querySelectorAll("audio").forEach((el) => {
            if (el.classList.contains("background-music")) {
                el.muted = !isEnabled;
            }
        });
    };

    const handleSoundToggle = (e) => {
        const isEnabled = e.target.checked;
        setSound(isEnabled);
        document
            .querySelectorAll("audio:not(.background-music)")
            .forEach((el) => {
                el.muted = !isEnabled;
            });
    };

    // Change username in Firebase
    const handleUsernameChange = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsSubmitting(true);

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("uid", "==", auth.currentUser.uid));
            const curUser = await getDocs(q);

            if (!curUser.empty) {
                const userDoc = doc(db, "users", curUser.docs[0].id);
                await updateDoc(userDoc, {
                    username: username,
                });
                setSubmitSuccess(true);
                setTimeout(() => setSubmitSuccess(false), 3000);
                setUsername("");
            } else {
                console.error("User not found");
            }
        } catch (error) {
            console.error("Error updating username:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogOut = () => {
        const auth = getAuth();
        auth.signOut();
        navigate("/login");
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-b from-blue-400 to-purple-300 overflow-hidden">
            <Container
                maxWidth="lg"
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    py: 5,
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
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
                            zIndex: 30,
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
                        Settings
                    </Typography>
                    <Box sx={{ width: 48, zIndex: 30 }} />{" "}
                    {/* Empty box for alignment */}
                </Box>

                {/* Settings Panel */}
                <Box
                    sx={{
                        backgroundColor: "rgba(255, 140, 0, 0.9)",
                        padding: 4,
                        borderRadius: "24px",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        border: "8px solid #ff7000",
                        maxHeight: "80vh",
                        overflow: "auto",
                        zIndex: 30,
                    }}
                >
                    {/* Music Setting */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            padding: 3,
                            borderRadius: 4,
                            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
                            zIndex: 30,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <MusicNoteIcon
                                sx={{ fontSize: 30, color: "white" }}
                            />
                            <Typography
                                variant="h5"
                                sx={{ color: "white", fontWeight: "bold" }}
                            >
                                Music
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                zIndex: 30,
                            }}
                        >
                            <Switch
                                checked={music}
                                onChange={handleMusicToggle}
                                sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                        color: "#3b82f6",
                                    },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                        {
                                            backgroundColor: "#3b82f6",
                                        },
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Sound Setting */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            padding: 3,
                            borderRadius: 4,
                            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
                            zIndex: 30,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                zIndex: 30,
                            }}
                        >
                            <VolumeUpIcon
                                sx={{ fontSize: 30, color: "white" }}
                            />
                            <Typography
                                variant="h5"
                                sx={{ color: "white", fontWeight: "bold" }}
                            >
                                Sound
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <IconButton
                                onClick={playTestSound}
                                sx={{
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#2563eb" },
                                    padding: "5px",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                    border: "2px solid white",
                                    fontSize: 12,
                                    marginRight: 1,
                                    zIndex: 30,
                                }}
                            >
                                Test
                            </IconButton>
                            <Switch
                                checked={sound}
                                onChange={handleSoundToggle}
                                sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                        color: "#3b82f6",
                                    },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                        {
                                            backgroundColor: "#3b82f6",
                                        },
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Username Setting */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            backgroundColor: "rgba(255,255,255,0.2)",
                            padding: 3,
                            borderRadius: 4,
                            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
                            zIndex: 30,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                zIndex: 30,
                            }}
                        >
                            <PersonIcon sx={{ fontSize: 30, color: "white" }} />
                            <Typography
                                variant="h5"
                                sx={{ color: "white", fontWeight: "bold" }}
                            >
                                Change Username
                            </Typography>
                        </Box>
                        <Box
                            component="form"
                            onSubmit={handleUsernameChange}
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 2,
                                alignItems: "stretch",
                                zIndex: 30,
                            }}
                        >
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter new username"
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    border: "3px solid white",
                                    backgroundColor: "rgba(255,255,255,0.7)",
                                    fontSize: "16px",
                                    color: "#333",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    flexGrow: 1,
                                    outline: "none",
                                }}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !username.trim()}
                                style={{
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    padding: "12px 24px",
                                    borderRadius: "12px",
                                    fontWeight: "bold",
                                    border: "3px solid white",
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                    cursor:
                                        isSubmitting || !username.trim()
                                            ? "not-allowed"
                                            : "pointer",
                                    opacity:
                                        isSubmitting || !username.trim()
                                            ? 0.7
                                            : 1,
                                    fontSize: "16px",
                                }}
                            >
                                {isSubmitting ? "Updating..." : "Submit"}
                            </button>
                        </Box>
                        {submitSuccess && (
                            <Typography
                                sx={{
                                    color: "white",
                                    backgroundColor: "rgba(16, 185, 129, 0.8)",
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    zIndex: 30,
                                }}
                            >
                                Username updated successfully!
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Logout Button */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 4,
                        zIndex: 30,
                    }}
                >
                    <button
                        onClick={handleLogOut}
                        style={{
                            backgroundColor: "#ef4444",
                            color: "white",
                            padding: "15px 30px",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            border: "4px solid white",
                            boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                            transition: "transform 0.2s",
                            fontSize: "18px",
                            cursor: "pointer",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                        }
                    >
                        <LogoutIcon />
                        LOG OUT
                    </button>
                </Box>
            </Container>
        </div>
    );
}
