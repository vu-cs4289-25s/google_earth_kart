import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SocketProvider } from "../components/SocketContext"; // Import the provider
import Game from "../components/Game.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import KartSelection from "../components/KartSelection.jsx";
import Settings from "../components/Settings.jsx";
import Podium from "../components/Podium.jsx";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { getAuth } from "firebase/auth";

function App() {
    const auth = getAuth();

    return (
        <>
            {/* Earth background container */}
            <div className="earth-background">
                <div className="continent continent-1"></div>
                <div className="continent continent-2"></div>
                <div className="continent continent-3"></div>
                <div className="continent continent-4"></div>
                <div className="continent continent-5"></div>
                <div className="continent continent-6"></div>

                <div className="water-highlight highlight-1"></div>
                <div className="water-highlight highlight-2"></div>
                <div className="water-highlight highlight-3"></div>
                <div className="water-highlight highlight-4"></div>

                {/* Mini Racing Cars */}
                {/* Horizontal Paths at Different Heights */}
                <div className="mini-car car-red car-path-1"></div>
                <div
                    className="mini-car car-blue car-path-2"
                    style={{ animationDelay: "7s" }}
                ></div>
                <div
                    className="mini-car car-yellow car-path-6"
                    style={{ animationDelay: "3s" }}
                ></div>
                <div
                    className="mini-car car-green car-path-9"
                    style={{ animationDelay: "5s" }}
                ></div>
                <div
                    className="mini-car car-purple car-path-13"
                    style={{ animationDelay: "9s" }}
                ></div>

                {/* Vertical Paths at Different Positions */}
                <div
                    className="mini-car car-red car-path-4"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="mini-car car-blue car-path-7"
                    style={{ animationDelay: "6s" }}
                ></div>
                <div
                    className="mini-car car-green car-path-8"
                    style={{ animationDelay: "4s" }}
                ></div>
                <div
                    className="mini-car car-yellow car-path-11"
                    style={{ animationDelay: "8s" }}
                ></div>
                <div
                    className="mini-car car-purple car-path-12"
                    style={{ animationDelay: "1s" }}
                ></div>

                {/* Diagonal and Complex Paths */}
                <div
                    className="mini-car car-red car-tiny car-path-5"
                    style={{ animationDelay: "3.5s" }}
                ></div>
                <div
                    className="mini-car car-blue car-small car-path-14"
                    style={{ animationDelay: "8.5s" }}
                ></div>
                <div
                    className="mini-car car-yellow car-large car-path-15"
                    style={{ animationDelay: "5.5s" }}
                ></div>
                <div
                    className="mini-car car-green car-tiny car-path-3"
                    style={{ animationDelay: "1.5s" }}
                ></div>
                <div
                    className="mini-car car-purple car-small car-path-10"
                    style={{ animationDelay: "6.5s" }}
                ></div>

                {/* Additional Cars with More Random Delays */}
                <div
                    className="mini-car car-red car-path-1"
                    style={{ animationDelay: "4.2s" }}
                ></div>
                <div
                    className="mini-car car-blue car-path-2"
                    style={{ animationDelay: "9.7s" }}
                ></div>
                <div
                    className="mini-car car-yellow car-tiny car-path-3"
                    style={{ animationDelay: "2.3s" }}
                ></div>
                <div
                    className="mini-car car-green car-small car-path-4"
                    style={{ animationDelay: "7.1s" }}
                ></div>
                <div
                    className="mini-car car-purple car-large car-path-5"
                    style={{ animationDelay: "3.8s" }}
                ></div>

                {/* More Cars with Varied Sizes and More Random Placement */}
                <div
                    className="mini-car car-green car-tiny car-path-15"
                    style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                    className="mini-car car-red car-small car-path-14"
                    style={{ animationDelay: "10.2s" }}
                ></div>
                <div
                    className="mini-car car-blue car-path-13"
                    style={{ animationDelay: "5.9s" }}
                ></div>
                <div
                    className="mini-car car-yellow car-tiny car-path-12"
                    style={{ animationDelay: "9.3s" }}
                ></div>
                <div
                    className="mini-car car-purple car-small car-path-11"
                    style={{ animationDelay: "3.2s" }}
                ></div>
            </div>
            <SocketProvider>
                <Router>
                    <Routes>
                        <Route path="/game" element={<Game />} />
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/kart-select"
                            element={<KartSelection />}
                        />
                        <Route path="/settings" element={<Settings />} />
                        <Route
                            path="/podium"
                            element={<Podium leaderboard={[]} />}
                        />
                    </Routes>
                </Router>
            </SocketProvider>
        </>
    );
}

export default App;
