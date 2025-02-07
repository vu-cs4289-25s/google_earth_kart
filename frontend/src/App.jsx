import Game from "../components/Game.jsx";
import "./App.css"

function App() {
  return (
      <>
        <ul id="broadcast"></ul>
        <form id="form" action="">
          <input id="input" autoComplete="off"/>
          <button>Send</button>
        </form>
        <Game/>
      </>
  )
}

export default App
