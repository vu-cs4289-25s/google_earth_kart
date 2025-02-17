import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

const socket = io("http://localhost:3001");


export default function Broadcast () {
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        const input = inputRef.current;
      
        if (input) {
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    input.select();
                }
            });
        }
      
          socket.on("chat message", (msg) => {
            setMessages((prev) => [...prev, msg]);
            msgTimeout(msg);
          });
      
          // User connected
          socket.on("connected", () => {
            setMessages((prev) => [...prev, "A user connected"]);
            msgTimeout("A user connected");
          });
      
          // User disconnected
          socket.on("disconnected", () => {
            setMessages((prev) => [...prev, "A user disconnected"]);
            msgTimeout("A user disconnected");
          });
      
          function msgTimeout(msg) {
            // IMPORTANT: Right now this function will filter out (delete) the message matching the one passed in as a parameter.
            // This means all messages with the same content are removed. We can adjust this, but it will involve creating
            // an object with a date-time key which is more involved. Can consider later.
            setTimeout(() => {
              setMessages((prev) => prev.filter((m) => m !== msg));
            }, 5000);
          }
          
          return () => {
            socket.off("chat message");
            socket.off("connected");
            socket.off("disconnected");
          };
      
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        if (input.value) {
            socket.emit("chat message", input.value);
            input.value = "";
            input.blur();
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
                <input id="input" autoComplete="off" />
                <button type="submit">Send</button>
            </form>
        </>
    )

}