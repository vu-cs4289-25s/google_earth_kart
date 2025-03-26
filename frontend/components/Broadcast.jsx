import { useEffect, useRef, useState } from "react";
import { useSocket } from "./SocketContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
    collection,
    query,
    where,
    getDocs,
    getFirestore,
} from "firebase/firestore";

export default function Broadcast() {
    const { socket } = useSocket();
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");
    const inputRef = useRef(null);
    const db = getFirestore();

    // Fetch the user's username from Firestore
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userRef = collection(db, "users");
                    const q = query(userRef, where("uid", "==", user.uid));
                    const curUser = await getDocs(q);

                    if (!curUser.empty) {
                        const userData = curUser.docs[0].data();
                        setUsername(userData.username);
                    } else {
                        setUsername(user.displayName);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUsername(user.displayName || "User");
                }
            }
        });
        return () => unsubscribe();
    }, [db]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg, user) => {
            setMessages((prev) => [...prev, `${user}: ${msg}`]);
            msgTimeout(`${user}: ${msg}`);
        };

        const handleConnection = () => {
            setMessages((prev) => [...prev, "A user connected"]);
            msgTimeout("A user connected");
        };

        const handleDisconnection = () => {
            setMessages((prev) => [...prev, "A user disconnected"]);
            msgTimeout("A user disconnected");
        };

        socket.on("chat message", handleMessage);
        socket.on("connected", handleConnection);
        socket.on("disconnected", handleDisconnection);

        return () => {
            socket.off("chat message", handleMessage);
            socket.off("connected", handleConnection);
            socket.off("disconnected", handleDisconnection);
        };
    }, [socket, username]);

    function msgTimeout(msg) {
        setTimeout(() => {
            setMessages((prev) => prev.filter((m) => m !== msg));
        }, 5000);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (inputRef.current.value) {
            socket.emit("chat message", inputRef.current.value, username);
            inputRef.current.value = "";
            inputRef.current.blur();
        }
    }

    return (
        <>
            <ul id="broadcast">
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <form id="form" onSubmit={handleSubmit}>
                <input id="input" ref={inputRef} autoComplete="off" />
                <button type="submit">Send</button>
            </form>
        </>
    );
}
