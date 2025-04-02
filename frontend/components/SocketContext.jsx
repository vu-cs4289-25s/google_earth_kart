import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BACKEND_URL);

        newSocket.on("connected", (playerList) => {
            console.log("A player connected");
            setPlayers(playerList);
        });

        newSocket.on("disconnected", (playerList) => {
            setPlayers(playerList);
        });

        newSocket.on("update players", (msg) => {});

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, players }}>
            {children}
        </SocketContext.Provider>
    );
};
