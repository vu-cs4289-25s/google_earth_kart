import { useEffect } from "react";
import Game from "../components/Game.jsx";
import "./App.css"
import { useMultiplayerState } from 'playroomkit'

function App() {
  const [messages, setMessages] = useMultiplayerState('messages',[]);

  useEffect(() => {
    const form = document.getElementById("form");
    const input = document.getElementById("input");

    form.addEventListener("submit",(e) => {
      e.preventDefault();
      const msg = input.value;
      if (msg) {
        setMessages((prev) => [...prev, msg]);
        msgTimeout(msg);
        input.value = "";
      }
    });

    function msgTimeout(msg) {
      // IMPORTANT: Right now this function will filter out (delete) the message matching the one passed in as a parameter.
      // This means all messages with the same content are removed. We can adjust this, but it will involve creating
      // an object with a date-time key which is more involved. Can consider later.
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m !== msg));
      }, 5000);
    }
    
  }, []);

  return (
      <>
        <ul id="broadcast">
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
        <form id="form" action="submit">
          <input id="input" autoComplete="off"/>
          <button>Send</button>
        </form>
        <Game/>
      </>
  )
}

export default App
