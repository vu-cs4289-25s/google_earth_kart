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
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "20px",
                borderRadius: "10px",
                maxWidth: "400px",
                margin: "0 auto",
                zIndex: 1000,
            }}
        >
            <h2 style={{ textAlign: "center" }}>Leaderboard</h2>
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {leaderboard.map((player, index) => (
                    <li
                        key={player.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                    >
                        <span>
                            {index + 1}. {player.username}
                        </span>
                        <span>{player.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}