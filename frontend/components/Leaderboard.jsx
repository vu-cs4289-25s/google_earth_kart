import { useEffect, useState } from "react";
import { useSocket } from "./SocketContext";


export default function Leaderboard() {
    const { socket } = useSocket();
    const [leaderboard, setLeaderboard] = useState([]);

    //update leaderboard when a player hits a checkpoint
    useEffect(() => {
        if (!socket) return;

        const handleLeaderboardUpdate = (updatedLeaderboard) => {
            setLeaderboard(updatedLeaderboard);
        };

        socket.on("leaderboard update", handleLeaderboardUpdate);

        return () => {
            socket.off("leaderboard update", handleLeaderboardUpdate);
        };
    }, [socket]);

    return (
        <div
            style={{
                position: "absolute",
                top: "300px",
                right: "5px",
                backgroundColor: "rgba(255, 140, 0, 0.9)",
                color: "white",
                padding: "15px",
                borderRadius: "16px",
                maxWidth: "220px",
                margin: "0 auto",
                zIndex: 1000,
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                border: "4px solid #ff7000",
                overflow: "hidden",
            }}
        >
             <h2 
                style={{ 
                    textAlign: "center", 
                    margin: "0 0 10px 0",
                    color: "white",
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    fontSize: "1.5rem",
                }}
            >
                Leaderboard
            </h2>
            <ul 
                style={{ 
                    listStyleType: "none", 
                    padding: 0,
                    margin: 0,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
                }}
            >
                {leaderboard.map((player, index) => (
                    <li
                        key={player.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            borderBottom: index !== leaderboard.length - 1 ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
                            backgroundColor: player.id === socket?.id ? "rgba(59, 130, 246, 0.6)" : "transparent",
                            fontWeight: player.id === socket?.id ? "bold" : "normal",
                        }}
                    >
                        <span>
                            {index + 1}. {player.username}
                        </span>
                        <span style={{ 
                            backgroundColor: "#3b82f6",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            border: "1px solid white",
                        }}>
                            {player.score}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}