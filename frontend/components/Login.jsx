import { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../src/firebaseConfig.js"; 

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app); // Use the initialized Firebase app

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username) {
            onLogin(username);
        }
    };

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // Use the user's display name as the username
                onLogin(user.displayName);
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error("Error during Google sign-in:", errorCode, errorMessage, email, credential);
            });
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column" }}
            >
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        marginBottom: "10px",
                        padding: "10px",
                        fontSize: "16px",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        cursor: "pointer",
                        marginBottom: "10px",
                    }}
                >
                    Login
                </button>
            </form>
            <button
                onClick={handleGoogleSignIn}
                style={{
                    padding: "10px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Sign in with Google
            </button>
        </div>
    );
}

export default Login;