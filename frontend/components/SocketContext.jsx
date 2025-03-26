import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
      // Retrieve or create a persistent user id from local storage
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem("userId", userId);
        // DEBUG
        console.log("Generated new user id:", userId);
      }

      // Pass the userId as a query parameter when connecting
      const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        query: { id: userId },
      });

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
