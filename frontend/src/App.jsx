import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "../components/Game.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
    //you can use auth.currentUser to get current user
    const auth = getAuth();

    return (
        <Router>
            <Routes>
                <Route path="/game" element={<Game />}/>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
