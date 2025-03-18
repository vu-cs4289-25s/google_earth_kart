import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Switch, Typography, Card } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    const navigate = useNavigate();
    const db = getFirestore();
    const auth = getAuth();

    // Add test sound with a beep
    const playTestSound = () => {
        const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 440; // A4 note
        gainNode.gain.value = sound ? 0.1 : 0; // Volume based on sound setting

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
    //change username in firebase
    const handleUsernameChange = async (e) => {
        e.preventDefault();
        const userRef = collection(db, "users");
        const q = query(userRef, where("uid", "==", auth.currentUser.uid));
        const curUser = await getDocs(q);
        if (!curUser.empty) {
            const userDoc = doc(db, "users", curUser.docs[0].id);
            await updateDoc(userDoc, {
                username: username,
            });
            setUsername("");
        } else {
            console.error("User not found");
        }
    };
    const handleLogOut = () => {
        const auth = getAuth();
        auth.signOut();
        navigate("/login");
    };

    return (
        <Box className="h-screen w-screen bg-gradient-to-br from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 space-y-6 relative">
                <IconButton
                    className="absolute left-4 top-4"
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIcon />
                </IconButton>

                <Typography variant="h4" className="text-center mb-8 mt-4">
                    Settings
                </Typography>

                <Box className="space-y-6">
                    <Box className="flex justify-between items-center">
                        <Typography variant="h6">Music</Typography>
                        <Box className="flex items-center gap-2">
                            <Switch
                                checked={music}
                                onChange={handleMusicToggle}
                            />
                            <IconButton size="small" onClick={playTestSound}>
                                <Typography variant="caption">Test</Typography>
                            </IconButton>
                        </Box>
                    </Box>

                    <Box className="flex justify-between items-center">
                        <Typography variant="h6">Sound</Typography>
                        <Switch checked={sound} onChange={handleSoundToggle} />
                    </Box>
                    <Box className="flex justify-between items-center">
                        <Typography variant="h6">Change Username</Typography>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        />
                        <button onClick={handleUsernameChange}>Submit</button>
                    </Box>
                    <Box className="flex justify-between items-center space-x-4">
                        <button onClick={handleLogOut}>Log Out</button>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}
