import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    Typography,
    IconButton,
    Switch,
    TextField,
    Card,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
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

const Settings = () => {
    const [music, setMusic] = useState(true);
    const [sound, setSound] = useState(true);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const db = getFirestore();
    const auth = getAuth();

    const playTestSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 440;
        gainNode.gain.value = sound ? 0.1 : 0;

        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);
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
        document.querySelectorAll("audio:not(.background-music)").forEach((el) => {
            el.muted = !isEnabled;
        });
    };

    const handleUsernameChange = async (e) => {
        e.preventDefault();
        const userRef = collection(db, "users");
        const q = query(userRef, where("uid", "==", auth.currentUser.uid));
        const curUser = await getDocs(q);
        if (!curUser.empty) {
            const userDoc = doc(db, "users", curUser.docs[0].id);
            await updateDoc(userDoc, { username });
            setUsername("");
        } else {
            console.error("User not found");
        }
    };

    const handleLogOut = () => {
        auth.signOut();
        navigate("/login");
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-400 to-purple-300 overflow-hidden">
            <Container
                maxWidth="sm"
                sx={{
                    py: 5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        mb: 4,
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <IconButton
                        onClick={() => navigate("/kart-select")}
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
                        variant="h4"
                        sx={{
                            color: "#fff",
                            fontWeight: "bold",
                            textAlign: "center",
                            flex: 1,
                            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                        }}
                    >
                        Settings
                    </Typography>
                </Box>

                <Card
                    sx={{
                        width: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        padding: 4,
                        borderRadius: "24px",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Music
                        </Typography>
                        <Switch checked={music} onChange={handleMusicToggle} />
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Sound
                        </Typography>
                        <Switch checked={sound} onChange={handleSoundToggle} />
                        <Button
                            variant="outlined"
                            sx={{ ml: 2 }}
                            onClick={playTestSound}
                        >
                            Test
                        </Button>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Change Username
                        </Typography>
                        <TextField
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter new username"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUsernameChange}
                        >
                            Submit
                        </Button>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={handleLogOut}
                        >
                            Log Out
                        </Button>
                    </Box>
                </Card>
            </Container>
        </div>
    );
};

export default Settings;
