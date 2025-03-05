import { useEffect, useRef, useState } from "react";
import { useSocket } from "./SocketContext";

export default function Broadcast() {
    const { socket } = useSocket();
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
            msgTimeout(msg);
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
    }, [socket]);

    function msgTimeout(msg) {
        setTimeout(() => {
            setMessages((prev) => prev.filter((m) => m !== msg));
        }, 5000);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (inputRef.current.value) {
            socket.emit("chat message", inputRef.current.value);
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
